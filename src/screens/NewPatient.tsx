import { Heading, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Barbell, Calendar, IdentificationBadge, Ruler } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';

import patientService from '../services/patientService';

type RouteParams = {
    institutionId: string;
};

export function NewPatient() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [birthdate, setBirthdate] = useState<string>();
    const [height, setHeight] = useState<string>();
    const [weight, setWeight] = useState<string>();

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const addPatient = () => {
        if (!name || !birthdate) {
            setIsRequired(true);
            return;
        };

        setIsRequired(false);
        setIsLoading(true);

        if (!birthdate.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)) return;

        patientService.postPatient(
            institutionId,
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

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Novo paciente
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            bg="white"
                            mb={3}
                            isInvalid={isRequired && !name}
                        />

                        <Input
                            placeholder="Data de nascimento"
                            InputLeftElement={<Icon as={<Calendar color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setBirthdate}
                            bg="white"
                            mb={3}
                            isInvalid={isRequired && !birthdate}
                        />

                        <Input
                            placeholder="Altura (opcional)"
                            InputLeftElement={<Icon as={<Ruler color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setHeight}
                            bg="white"
                            mb={3}
                        />

                        <Input
                            placeholder="Peso (opcional)"
                            InputLeftElement={<Icon as={<Barbell color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setWeight}
                            bg="white"
                        />
                    </VStack>

                    <Button
                        title="Criar"
                        variant="cyan"
                        w="153"
                        ml="160"
                        mt={5}
                        onPress={() => addPatient()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}