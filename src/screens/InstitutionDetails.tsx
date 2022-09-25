import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, Buildings, Medal, Bed, UsersThree, Calendar } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { GroupMember, Institution } from '../@types';
import { useDispatch, useSelector } from '../hooks';

import institutionService from '../services/institutionService';
import { setInstitutionPermissions } from '../store/reducers/authorizationReducer';
import memberService from '../services/memberService';

type RouteParams = {
    institutionId: string;
    isOwner: boolean;
    memberId: string;
    memberPermissions?: number;
};

export const toDateFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export function InstitutionDetails() {
    const [institutionData, setInstitutionData] = useState<Institution>(null);
    const [memberGroupMemberships, setMemberGroupMemberships] = useState<GroupMember[]>(null);
    const [groups, setGroups] = useState<ListItemProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const dispatch = useDispatch();

    const { institutionId, isOwner, memberId, memberPermissions } = route.params as RouteParams;
    const isModerator = memberPermissions && memberPermissions === 222;

    useFocusEffect(
        React.useCallback(() => {
            institutionService.getInstitution(institutionId)
                .then(response => {
                    setInstitutionData(response.data);
                    if (!isOwner) {
                        memberService.getMember(memberId)
                            .then(response => {
                                setMemberGroupMemberships(response.data.GroupMember);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    } else {
                        setMemberGroupMemberships([]);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }, [])
    );

    useEffect(() => {
        dispatch(setInstitutionPermissions({ isOwner: isOwner, isModerator: isModerator }));
    }, []);

    useEffect(() => {
        if (institutionData && memberGroupMemberships?.length >= 0) {
            const institutionGroups = institutionData.Group.map<ListItemProps>(group => {
                let response: ListItemProps | null;

                if (isOwner) {
                    response = {
                        id: group.id,
                        name: group.name,
                        patient: group._count.Patient,
                        groupMemberId: null
                    };
                } else {
                    const groupMembership = memberGroupMemberships.find(groupMembership => groupMembership.groupId === group.id)
                    response = groupMembership
                        ? {
                            id: group.id,
                            name: group.name,
                            patient: group._count.Patient,
                            groupMemberId: groupMembership.id
                        }
                        : undefined;
                }

                return response;
            });

            setGroups(institutionGroups.filter(group => group !== undefined));
            setIsLoading(false);
        }
    }, [institutionData, memberGroupMemberships])

    function handleOpenDetails(groupId: string, groupMemberId: string) {
        navigation.navigate('groupDetails', { groupId, groupMemberId });
    };

    const handleNewGroup = () => {
        navigation.navigate('newGroup', { institutionId });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="Detalhes da instituição" mr={88} />

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
                            <VStack>
                                <Heading fontSize="md" mb={3}>{institutionData.name}</Heading>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <Medal size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData.User.fullname}</Text>
                                </HStack>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <Bed size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData._count.Patient} pacientes</Text>
                                </HStack>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <UsersThree size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData._count.Member} membros</Text>
                                </HStack>
                                <HStack w="full" alignItems="center">
                                    <Calendar size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{toDateFormat(institutionData.createdAt)}</Text>
                                </HStack>
                            </VStack>

                            <Circle bg="orange.700" h={63} w={63} mr={5}>
                                <Buildings size={34} color="white" />
                            </Circle>
                        </HStack>

                        <Button
                            title="Gerenciar"
                            w="full"
                            my={14}
                            onPress={() => navigation.navigate('manageInstitution', { institutionId: institutionData.id })}
                            isDisabled={!isOwner && !isModerator}
                        />
                    </VStack>

                    <Heading color="gray.600" fontSize="lg" mb={4}>
                        Grupos
                    </Heading>

                    <FlatList
                        data={groups}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ListItem data={item} variant="group" onPress={() => handleOpenDetails(item.id, item.groupMemberId)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <SmileyMeh color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui{'\n'}
                                    grupos em sua instituição
                                </Text>
                            </Center>
                        )}
                    />
                </VStack>

                <Menu variant={(isOwner || isModerator) ? "group" : "blank"} onPress={() => (isOwner || isModerator) ? handleNewGroup() : {}} />
            </VStack>}
        </>
    );
}