import React, { useState } from 'react';
import { Heading, Icon, useTheme, VStack } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { IdentificationBadge } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import institutionService from '../services/institutionService';

type RouteParams = {
    institutionId: string;
};

export function ManageInstitution() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [confirmDeleteIntention, setConfirmDeleteIntention] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [name, setName] = useState<string>("");

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            institutionService.getInstitution(institutionId)
                .then((response) => {
                    setName(response.data.name);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }, [])
    );

    const updateInstitution = () => {
        setIsUpdating(true);
        institutionService.patchInstitution(institutionId, name)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                setError(error.message);
                setIsUpdating(false);
            });
    };

    const deleteInstitution = () => {
        setConfirmDeleteIntention(false);
        setIsDeleting(true);
        institutionService.deleteInstitution(institutionId)
            .then(() => {
                setConfirmDelete(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsDeleting(true);
            });
    }

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Gerenciar instituição
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            mb={4}
                            bg="white"
                            value={name}
                        />

                        <Button
                            title="Membros"
                            variant="green"
                            w="full"
                            mb={2}
                            onPress={() => navigation.navigate("manageMembers", { institutionId })}
                        />

                        <Button
                            title="Pacientes"
                            variant="cyan"
                            w="full"
                            onPress={() => navigation.navigate("managePatients", { institutionId })}
                        />

                    </VStack>

                    <Button
                        title="Salvar"
                        variant="orange"
                        w="153"
                        ml="160"
                        mt={8}
                        onPress={() => updateInstitution()}
                        isLoading={isUpdating}
                    />

                    <Button
                        title="Excluir instituição"
                        variant="red"
                        w="full"
                        position="absolute"
                        alignSelf="center"
                        bottom={10}
                        onPress={() => setConfirmDeleteIntention(true)}
                        isLoading={isDeleting}
                    />

                </VStack>

                <Menu variant="blank" />

                <Alert
                    title="Deseja realmente excluir a instituição?"
                    description="Todos os dados vinculados serão perdidos."
                    acceptButtonText="Sim"
                    acceptButtonColor="red"
                    cancelButtonText="Não"
                    isOpen={confirmDeleteIntention}
                    onCancel={() => setConfirmDeleteIntention(false)}
                    onAccept={deleteInstitution}
                />

                <Alert
                    title="Instituição excluída com sucesso!"
                    acceptButtonText="Voltar"
                    isOpen={confirmDelete}
                    onAccept={() => navigation.navigate('home')}
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