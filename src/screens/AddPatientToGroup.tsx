import { Center, Heading, Icon, useTheme, VStack, Text, FlatList } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MagnifyingGlass, MoonStars } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { SimpleListItem } from '../components/SimpleListItem';

import patientService from '../services/patientService';
import { Patient } from '../@types';

type RouteParams = {
    institutionId: string;
    groupId: string;
};

export function AddPatientToGroup() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [patientId, setPatientId] = useState<string>("");
    const [patients, setPatients] = useState<Patient[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId, groupId } = route.params as RouteParams;

    const filteredPatients = search ? patients.filter(patient => patient.fullname.includes(search)) : patients;

    useFocusEffect(
        React.useCallback(() => {
            patientService.getPatients(institutionId)
                .then(response => {
                    const unassignedPatients = response.data.filter(patient => !patient.groupId);
                    setPatients(unassignedPatients.sort((a, b) => a.fullname.localeCompare(b.fullname)));
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        console.log('error message: ', error.message);
                    } else {
                        console.log('unexpected error: ', error);
                    }
                    setIsLoading(false);
                });
        }, [])
    );

    const addPatient = () => {
        setIsLoading(true);
        patientService.patchPatient(patientId, null, null, null, null, groupId, institutionId)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
            });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={360} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Adicionar paciente ao grupo
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<MagnifyingGlass color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setSearch}
                            mb={4}
                            bg="white"
                            isDisabled={patients.length === 0}
                        />

                        <FlatList
                            data={filteredPatients}
                            mx={3}
                            h={350}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <SimpleListItem data={item} variant="patient" onPress={() => setPatientId(item.id)} selectedId={patientId} />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <Center>
                                    <MoonStars color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Não há pacientes{'\n'}cadastrados na instituição
                                    </Text>
                                </Center>
                            )}
                        />
                    </VStack>

                </VStack>

                <Button
                    title="Adicionar"
                    variant="green"
                    w="160"
                    mb={6}
                    ml={170}
                    onPress={() => addPatient()}
                    isDisabled={patients.length === 0}
                />

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}