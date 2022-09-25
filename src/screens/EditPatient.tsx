import React, { useState } from 'react';
import { Heading, HStack, Icon, useTheme, VStack } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { Barbell, Calendar, IdentificationBadge, Ruler } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import patientService from '../services/patientService';

import { toBrazilianFormat, toISOFormat } from './NewPatient';

type RouteParams = {
    patientId: string;
};

export const leaveNumbersOnly = (date: string) => {
    const parsedDate = new Date(date);

    const day = parsedDate.getDate().toString();
    const month = (parsedDate.getMonth() + 1).toLocaleString();
    const year = parsedDate.getFullYear().toString();

    return `${day.length === 1 ? "0" + day : day}${month.length === 1 ? "0" + month : month}${year}`
};

export function EditPatient() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [invalidDate, setInvalidDate] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [confirmDeleteIntention, setConfirmDeleteIntention] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
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
                    setBirthdate(leaveNumbersOnly(patient.birthDate));
                    setHeight(patient.height?.toString() ?? "");
                    setWeight(patient.weight?.toString() ?? "");
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }, [])
    );

    const updatePatient = () => {
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
        setIsUpdating(true);
        patientService.patchPatient(
            patientId,
            name,
            new Date(toISOFormat(birthdate)).toISOString(),
            parseFloat(height),
            parseFloat(weight)
        )
            .then(() => {
                setConfirmUpdate(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsUpdating(false);
            });
    };

    const deletePatient = () => {
        setConfirmDeleteIntention(false);
        setIsDeleting(true);
        patientService.deletePatient(patientId)
            .then(() => {
                setConfirmDelete(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsDeleting(false);
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
                                onPress={() => setConfirmDeleteIntention(true)}
                                isLoading={isDeleting}
                            />

                            <Button
                                title="Salvar"
                                variant="cyan"
                                w="130"
                                mt={5}
                                onPress={() => updatePatient()}
                                isLoading={isUpdating}
                            />

                        </HStack>

                    </VStack>

                </VStack>

                <Menu variant="blank" />

                <Alert
                    title="Deseja realmente excluir o paciente?"
                    description="Todos os dados vinculados serão perdidos."
                    acceptButtonText="Sim"
                    acceptButtonColor="red"
                    cancelButtonText="Não"
                    isOpen={confirmDeleteIntention}
                    onCancel={() => setConfirmDeleteIntention(false)}
                    onAccept={deletePatient}
                />

                <Alert
                    title="Paciente excluído com sucesso!"
                    acceptButtonText="Voltar"
                    isOpen={confirmDelete}
                    onAccept={() => navigation.goBack()}
                />

                <Alert
                    title="Paciente atualizado com sucesso!"
                    acceptButtonText="Voltar"
                    isOpen={confirmUpdate}
                    onAccept={() => navigation.goBack()}
                />

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