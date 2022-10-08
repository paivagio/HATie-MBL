import React, { useState } from 'react';
import { Heading, Icon, useTheme, VStack } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { Article, IdentificationBadge } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import groupService from '../services/groupService';

type RouteParams = {
    groupId: string;
};

export function ManageGroup() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [confirmDeleteIntention, setConfirmDeleteIntention] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("")

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { groupId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            groupService.getGroup(groupId)
                .then((response) => {
                    setName(response.data.name);
                    setDescription(response.data.description);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }, [])
    );

    const updateGroup = () => {
        setIsUpdating(true);
        groupService.patchGroup(groupId, name, description)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                setError(error.message);
                setIsUpdating(false);
            });
    };

    const deleteGroup = () => {
        setConfirmDeleteIntention(false);
        setIsDeleting(true);
        groupService.deleteGroup(groupId)
            .then(() => {
                setConfirmDelete(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsDeleting(false);
            });
    }

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Gerenciar grupo
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            mb={2}
                            bg="white"
                            value={name}
                        />

                        <Input
                            placeholder="Descrição"
                            InputLeftElement={<Icon as={<Article color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setDescription}
                            mb={3}
                            bg="white"
                            value={description}
                        />

                        <Button
                            title="Responsáveis"
                            variant="green"
                            w="full"
                            onPress={() => navigation.navigate('manageGroupMembers', { groupId })}
                        />

                        <Button
                            title="Excluir grupo"
                            variant="red"
                            w="full"
                            position="absolute"
                            alignSelf="center"
                            bottom={-220}
                            onPress={() => setConfirmDeleteIntention(true)}
                            isLoading={isDeleting}
                        />

                        <Button
                            title="Salvar"
                            variant="darkblue"
                            w="full"
                            position="absolute"
                            alignSelf="center"
                            bottom={-290}
                            onPress={() => updateGroup()}
                            isLoading={isUpdating}
                        />

                    </VStack>

                </VStack>

                <Menu variant="blank" />

                <Alert
                    title="Deseja realmente excluir o grupo?"
                    description="Todos os dados vinculados serão perdidos."
                    acceptButtonText="Sim"
                    acceptButtonColor="red"
                    cancelButtonText="Não"
                    isOpen={confirmDeleteIntention}
                    onCancel={() => setConfirmDeleteIntention(false)}
                    onAccept={deleteGroup}
                />

                <Alert
                    title="Grupo excluído com sucesso!"
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