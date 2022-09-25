import React, { useState } from 'react';
import { Heading, Icon, useTheme, VStack } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Article, IdentificationBadge } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import groupService from '../services/groupService';

type RouteParams = {
    institutionId: string;
};

export function NewGroup() {
    const [error, setError] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [confirmCreation, setConfirmCreation] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const addGroup = () => {
        setIsCreating(true);
        groupService.postGroup(institutionId, name, description)
            .then(() => {
                setConfirmCreation(true);
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
                    Novo grupo
                </Heading>

                <VStack mx={6}>
                    <Input
                        placeholder="Nome"
                        InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                        onChangeText={setName}
                        mb={4}
                        bg="white"
                    />

                    <Input
                        placeholder="Descrição (opcional)"
                        InputLeftElement={<Icon as={<Article color={colors.gray[300]} />} ml={4} />}
                        onChangeText={setDescription}
                        bg="white"
                    />
                </VStack>

                <Button
                    title="Criar"
                    variant="green"
                    w="153"
                    ml="160"
                    mt={5}
                    onPress={() => addGroup()}
                    isLoading={isCreating}
                />

            </VStack>

            <Menu variant="blank" />

            <Alert
                title="Grupo criado!"
                acceptButtonText="Voltar"
                isOpen={confirmCreation}
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