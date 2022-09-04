import { Heading, HStack, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Barbell, Calendar, IdentificationBadge, Ruler } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';

import patientService from '../services/patientService';

import { toDateFormat } from './InstitutionDetails';

type RouteParams = {
    patientId: string;
};

export function EditPatient() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [birthdate, setBirthdate] = useState<string>();
    const [height, setHeight] = useState<string>();
    const [weight, setWeight] = useState<string>();

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { patientId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            patientService.getPatient(patientId)
                .then(response => {
                    const patient = response.data;
                    setName(patient.fullname);
                    setBirthdate(toDateFormat(patient.birthDate));
                    setHeight(patient.height?.toString() ?? "");
                    setWeight(patient.weight?.toString() ?? "");
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

    const updatePatient = () => {
        if (!name || !birthdate) {
            setIsRequired(true);
            return;
        };

        if (!birthdate.match(/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{2}$/)) return;

        setIsRequired(false);
        setIsLoading(true);

        patientService.patchPatient(
            patientId,
            name,
            new Date(birthdate).toISOString(),
            parseFloat(height),
            parseFloat(weight)
        )
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

    const deletePatient = () => {
        setIsLoading(true);
        patientService.deletePatient(patientId)
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
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Gerenciar paciente
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            value={name}
                            bg="white"
                            mb={3}
                            isInvalid={isRequired && !name}
                        />

                        <Input
                            placeholder="Data de nascimento"
                            InputLeftElement={<Icon as={<Calendar color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setBirthdate}
                            value={birthdate}
                            bg="white"
                            mb={3}
                            isInvalid={isRequired && !birthdate}
                        />

                        <Input
                            placeholder="Altura (opcional)"
                            InputLeftElement={<Icon as={<Ruler color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setHeight}
                            value={height}
                            bg="white"
                            mb={3}
                        />

                        <Input
                            placeholder="Peso (opcional)"
                            InputLeftElement={<Icon as={<Barbell color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setWeight}
                            value={weight}
                            bg="white"
                        />

                        <HStack w="full" alignItems="center" justifyContent="space-between">

                            <Button
                                title="Excluir"
                                variant="red"
                                w="130"
                                mt={5}
                                onPress={() => deletePatient()}
                            />

                            <Button
                                title="Salvar"
                                variant="cyan"
                                w="130"
                                mt={5}
                                onPress={() => updatePatient()}
                            />

                        </HStack>

                    </VStack>

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}