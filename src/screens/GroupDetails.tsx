import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, Bed, UsersThree, Calendar, UsersFour } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Group } from '../@types';
import { Loading } from '../components/Loading';
import groupService from '../services/groupService';
import { toDateFormat } from './InstitutionDetails';

type RouteParams = {
    groupId: string;
};

export function GroupDetails() {
    const [groupData, setGroupData] = useState<Group>(null);
    const [patients, setPatients] = useState<ListItemProps[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { groupId } = route.params as RouteParams;

    useEffect(() => {
        groupService.getGroup(groupId)
            .then(response => {
                setGroupData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (groupData && patients.length === 0) {
            const groupPatients = groupData.Patient.map<ListItemProps>((patient, key) => {
                return {
                    id: patient.id,
                    name: `Paciente #0${key + 1}`,
                    patientName: patient.fullname,
                    lastUpdated: daysBetween(patient.updatedAt)
                };
            });
            setPatients(groupPatients);
        }
    }, [groupData]);

    function handleOpenDetails(patientId: string) {
        navigation.navigate('patientDetails', { patientId });
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

                        <Button title="Gerenciar" w="full" my={14} />
                    </VStack>

                    <Heading color="gray.600" fontSize="lg" mb={4}>
                        Pacientes
                    </Heading>

                    <FlatList
                        data={patients}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ListItem data={item} variant="patient" onPress={() => handleOpenDetails(item.id)} />}
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

                <Menu variant="patient" onPress={() => console.log('Ferro e Lucas trouxas')} />
            </VStack>}
        </>
    );
}