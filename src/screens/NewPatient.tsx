import React, { useState } from 'react';
import { Heading, Icon, useTheme, VStack } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Barbell, Calendar, IdentificationBadge, Ruler } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import patientService from '../services/patientService';

type RouteParams = {
    institutionId: string;
};

export const toBrazilianFormat = (date: string) => {
    if (!date) return "";

    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4);

    let formatedDate = day ? `${day}` : "";
    formatedDate += month ? "/" + `${month}` : "";
    formatedDate += year ? "/" + `${year}` : "";

    return formatedDate
}

export const toISOFormat = (date: string) => {
    if (!date) return "";

    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4);

    return `${year}-${month}-${day}`
}

export function NewPatient() {
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [confirmCreate, setConfirmCreate] = useState<boolean>(false);
    const [invalidDate, setInvalidDate] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [birthdate, setBirthdate] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

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

        if (!toBrazilianFormat(birthdate).match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)) {
            setInvalidDate(true);
            return;
        };

        setInvalidDate(false);
        setIsCreating(true);
        patientService.postPatient(
            institutionId,
            name,
            new Date(toISOFormat(birthdate)).toISOString(),
            parseFloat(height),
            parseFloat(weight)
        )
            .then(() => {
                setConfirmCreate(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsCreating(false);
            });
    };

    return (
        <VStack flex={1} bg="background">
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
                        onChangeText={value => setBirthdate(value.replace(/\//g, "").slice(0, 8))}
                        value={toBrazilianFormat(birthdate)}
                        bg="white"
                        mb={3}
                        isInvalid={(isRequired && !birthdate) || invalidDate}
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

                    <Button
                        title="Criar"
                        variant="cyan"
                        w="full"
                        mt={10}
                        onPress={() => addPatient()}
                        isLoading={isCreating}
                    />
                </VStack>

            </VStack>

            <Menu variant="blank" />

            <Alert
                title="Paciente criado com sucesso!"
                acceptButtonText="Voltar"
                isOpen={confirmCreate}
                onAccept={() => navigation.goBack()}
            />

            <AlertPopup
                status="error"
                title="Tente novamente mais tarde!"
                description={error}
                onClose={() => setError("")}
                isOpen={error !== ""}
            />

        </VStack>
    );
}