import React, { useState } from 'react';
import { Center, Heading, Icon, useTheme, VStack, Text, FlatList } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { MagnifyingGlass, MoonStars } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { SimpleListItem } from '../components/SimpleListItem';
import { AlertPopup } from '../components/AlertPopup';

import patientService from '../services/patientService';

import { Patient } from '../@types';

type RouteParams = {
    institutionId: string;
};

export function ManagePatients() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [patients, setPatients] = useState<Patient[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const filteredPatients = search ? patients.filter(patient => patient.fullname.includes(search)) : patients;

    useFocusEffect(
        React.useCallback(() => {
            patientService.getPatients(institutionId)
                .then(response => {
                    setPatients(response.data.sort((a, b) => a.fullname.localeCompare(b.fullname)));
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }, [])
    );

    const handleNewPatient = () => {
        navigation.navigate('newPatient', { institutionId });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={360} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Pacientes
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
                            h={450}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <SimpleListItem data={item} variant="patient" onPress={() => navigation.navigate("editPatient", { patientId: item.id })} selectedId="" />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
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

                <Menu variant="patient" onPress={() => handleNewPatient()} />

                <AlertPopup
                    status="error"
                    title="Tente novamente mais tarde!"
                    description={error}
                    onClose={() => setError("")}
                    isOpen={error !== ""}
                />

            </VStack>}
        </>
    );
}