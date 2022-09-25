import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, Bed, UsersThree, Calendar, UsersFour } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Group, GroupMember } from '../@types';
import { Loading } from '../components/Loading';
import groupService from '../services/groupService';
import { toDateFormat } from './InstitutionDetails';
import { useDispatch, useSelector } from '../hooks';
import { StoreState } from '../store/store';
import groupMemberService from '../services/groupMemberService';
import { setGroupPermissions } from '../store/reducers/authorizationReducer';


type RouteParams = {
    groupId: string;
    groupMemberId: string;
};

const getGroupMemberAccessLevel = (authorizations?: number) => {
    return authorizations
        ? { canRead: authorizations >= 1, canWrite: authorizations >= 11, canDelete: authorizations >= 111 }
        : { canRead: false, canWrite: false, canDelete: false }
}

export function GroupDetails() {
    const { isOwner, isModerator } = useSelector((state: StoreState) => state.access);

    const [groupData, setGroupData] = useState<Group>(null);
    const [groupMemberData, setGroupMemberData] = useState<GroupMember>(null);
    const [patients, setPatients] = useState<ListItemProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const route = useRoute();

    const { groupId, groupMemberId } = route.params as RouteParams;

    const { canRead, canWrite, canDelete } = getGroupMemberAccessLevel(groupMemberData?.authorizations);

    useFocusEffect(
        React.useCallback(() => {
            groupService.getGroup(groupId)
                .then(response => {
                    setGroupData(response.data);
                    if (!isOwner) {
                        groupMemberService.getGroupMember(groupMemberId)
                            .then(response => {
                                setGroupMemberData(response.data);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                    setIsLoading(false);
                });
        }, [])
    );

    useEffect(() => {
        if (groupData) {
            const groupPatients = groupData.Patient.map<ListItemProps>((patient, key) => {
                return {
                    id: patient.id,
                    name: `Paciente #0${key + 1}`,
                    patientName: patient.fullname,
                    lastUpdated: daysBetween(patient.updatedAt)
                };
            });
            setPatients(groupPatients);
            setIsLoading(false);
        }
    }, [groupData]);

    useEffect(() => {
        if (groupMemberData) {
            dispatch(setGroupPermissions({ canRead, canWrite, canDelete }))
        }
    }, [groupMemberData]);

    const handleOpenDetails = (patientId: string, patientTitle: string) => {
        navigation.navigate('patientDetails', { patientId, patientTitle });
    };

    const handleAddPatientToGroup = () => {
        navigation.navigate('addPatientToGroup', { institutionId: groupData.institutionId, groupId });
    };

    const daysBetween = (dateString: string): string => {
        const date = new Date(dateString);
        const daysBetween = Math.floor((Date.now() - date.getTime()) / (24 * 3600 * 1000));
        return `${daysBetween}d`;
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="Detalhes do grupo" mr={110} />

                <VStack flex={1} px={6}>

                    <VStack>
                        <HStack
                            w="full"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            bg="white"
                            py={15}
                            px={14}
                            mt={14}
                            rounded="sm"
                        >
                            <VStack
                                flex={1}
                                justifyContent="flex-start"
                            >
                                <Heading fontSize="md" mb={1}>{groupData.name}</Heading>
                                <Text fontSize="xs" mb={3} >{groupData.description}</Text>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <Bed size={18} color={colors.blue[500]} />
                                    <Text ml={2} fontSize="xs">{groupData.Patient.length} pacientes</Text>
                                </HStack>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <UsersThree size={18} color={colors.blue[500]} />
                                    <Text ml={2} fontSize="xs">{groupData._count.GroupMember} responsáveis</Text>
                                </HStack>
                                <HStack w="full" alignItems="center">
                                    <Calendar size={18} color={colors.blue[500]} />
                                    <Text ml={2} fontSize="xs">{toDateFormat(groupData.createdAt)}</Text>
                                </HStack>
                            </VStack>

                            <Circle bg="blue.500" h={63} w={63} mr={5}>
                                <UsersFour size={34} color="white" />
                            </Circle>
                        </HStack>

                        <Button
                            title="Gerenciar"
                            w="full"
                            my={14}
                            onPress={() => navigation.navigate('manageGroup', { groupId: groupData.id })}
                            isDisabled={!isOwner && !isModerator}
                        />
                    </VStack>

                    <Heading color="gray.600" fontSize="lg" mb={4}>
                        Pacientes
                    </Heading>

                    <FlatList
                        data={patients}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ListItem data={item} variant="patient" onPress={() => handleOpenDetails(item.id, item.name)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <SmileyMeh color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Não existem pacientes{'\n'}
                                    associados ao grupo
                                </Text>
                            </Center>
                        )}
                    />
                </VStack>

                <Menu variant={(isOwner || isModerator || canWrite) ? "patient" : "blank"} onPress={() => { (isOwner || isModerator || canWrite) ? handleAddPatientToGroup() : {} }} />
            </VStack>}
        </>
    );
}