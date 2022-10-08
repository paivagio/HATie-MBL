import React, { useState } from 'react';
import { FormControl, Heading, Icon, useTheme, VStack } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AxiosError } from 'axios';

import { IdentificationBadge, WarningCircle } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import memberService from '../services/memberService';
import userService from '../services/userService';

import { User } from '../@types';

type RouteParams = {
    institutionId: string;
};

export function NewMember() {
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isInviting, setIsInviting] = useState<boolean>(false);
    const [confirmInvite, setConfirmInvite] = useState<boolean>(false);
    const [userDoesNotExists, setUserDoesNotExists] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const addMember = async (user: User) => {
        if (!user) {
            setIsInviting(false);
            return;
        };

        memberService.postMember(institutionId, user.id)
            .then(() => {
                setConfirmInvite(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsInviting(false);
            });
    };

    const checkUserExists = async () => {
        if (!email) {
            setIsRequired(true);
            return;
        };

        setIsRequired(false);
        setIsInviting(true);

        userService.getUserByEmail(email)
            .then((response) => {
                setUserDoesNotExists(false);
                addMember(response.data);
            })
            .catch((error: AxiosError) => {
                if (error.code === AxiosError.ERR_BAD_REQUEST) {
                    setUserDoesNotExists(true);
                } else {
                    setError(error.message);
                }
                setIsInviting(false);
            });
    };

    return (
        <VStack flex={1} bg="background">
            <Header title="" mr={200} />

            <VStack flex={1} px={6}>
                <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                    Adicionar membro
                </Heading>

                <VStack mx={6}>

                    <FormControl mb={8} isInvalid={(isRequired && !email) || userDoesNotExists}>
                        <Input
                            placeholder="Email"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setEmail}
                            bg="white"
                            mb={3}
                            isInvalid={(isRequired && !email) || userDoesNotExists}
                        />
                        <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                            {email ? "Usuário não encontrado" : "Favor preencher o campo"}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <Button
                        title="Enviar convite"
                        variant="green"
                        w="full"
                        mt={5}
                        onPress={() => checkUserExists()}
                        isLoading={isInviting}
                    />

                </VStack>

            </VStack>

            <Menu variant="blank" />

            <Alert
                title="Convite enviado com sucesso!"
                acceptButtonText="Voltar"
                isOpen={confirmInvite}
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