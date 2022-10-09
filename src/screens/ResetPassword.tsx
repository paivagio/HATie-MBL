import React, { useState } from 'react';
import { VStack, Heading, Icon, useTheme, FormControl, HStack, Text, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';

import { Envelope, IdentificationBadge, Key, WarningCircle } from 'phosphor-react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AlertPopup } from '../components/AlertPopup';
import { Alert } from '../components/Alert';

import userService from '../services/userService';

import { User } from '../@types';


export function ResetPassword() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [user, setUser] = useState<User>(null);
    const [code, setCode] = useState<string>(null);
    const [email, setEmail] = useState<string>(null);
    const [password, setPassword] = useState<string>(null);
    const [confirmPassword, setConfirmPassword] = useState<string>(null);
    const [checkingEmail, setCheckingEmail] = useState<boolean>(true);
    const [checkingCode, setCheckingCode] = useState<boolean>(false);
    const [resetPassword, setResetPassword] = useState<boolean>(false);
    const [userDoesNotExists, setUserDoesNotExists] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [invalidCode, setInvalidCode] = useState<boolean>(false);
    const [confirmChangePassword, setConfirmChangePassword] = useState<boolean>(false);
    const [areBlankFields, setAreBlankFields] = useState<boolean>(false);
    const [differentPasswords, setDifferentPasswords] = useState<boolean>(false);
    const [invalidPasswordFormat, setInvalidPasswordFormat] = useState<boolean>(false);
    const [isChanging, setIsChanging] = useState<boolean>(false);

    const invalidMessage = invalidPasswordFormat
        ? "Senha precisa possuir:\n - 01 Letra maiúscula\n - 01 Letra minúscula\n - 01 Caracter especial\n - 01 Número"
        : areBlankFields
            ? "Favor preencher todos os campos."
            : differentPasswords
                ? "Senhas precisam ser iguais."
                : "";

    const checkUser = () => {
        setIsChecking(true);
        userService.getUserByEmail(email)
            .then(response => {
                setUser(response.data);
                setUserDoesNotExists(false);
                setIsChecking(false);
                setCheckingEmail(false);
                setCheckingCode(true);
            })
            .catch((error: AxiosError) => {
                if (error.message.includes("404")) setUserDoesNotExists(true);
                else setError(error.message);
                setIsChecking(false);
            });
    };

    const checkCode = () => {
        if (code && code === "123") {
            setCheckingCode(false);
            setResetPassword(true);
        } else {
            setInvalidCode(true);
        }
    };

    const handleChangePassword = () => {
        if (!password || !confirmPassword) {
            setAreBlankFields(true);
            return;
        }
        setAreBlankFields(false);

        if (!password.match(/[A-Z]/g) ||
            !password.match(/[a-z]/g) ||
            !password.match(/[!@#$%&*()]/g) ||
            !password.match(/[0-9]/g)) {
            setInvalidPasswordFormat(true);
            return;
        }
        setInvalidPasswordFormat(false);

        if (password !== confirmPassword) {
            setDifferentPasswords(true);
            return;
        }
        setDifferentPasswords(false);

        setIsChanging(true);
        userService.resetPassword(user.id, password, parseInt(code))
            .then(() => {
                setIsChanging(false);
                setConfirmChangePassword(true);
            }).catch((error) => {
                setError(error.message);
                setIsChanging(false);
            });
    }

    return (
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={20}>

            {checkingEmail &&
                <>
                    <Heading color="gray.600" fontSize="xl" mb={6} w="full">
                        Resetar senha
                    </Heading>

                    <Input
                        mb={4}
                        placeholder="E-mail"
                        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                        onChangeText={setEmail}
                        isInvalid={email === "" || userDoesNotExists}
                    />

                    <FormControl mb={2} isInvalid={userDoesNotExists}>
                        <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                            Nenhuma conta vinculada ao email inserido.
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <Button
                        mt={2}
                        mb={6}
                        title="Enviar código de verificação"
                        w="full"
                        variant="green"
                        onPress={checkUser}
                        isLoading={isChecking}
                    />
                </>
            }

            {checkingCode &&
                <>
                    <Heading color="gray.600" fontSize="xl" mb={6} w="full">
                        Insira o código recebido
                    </Heading>

                    <Input
                        mb={4}
                        placeholder="Código"
                        InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                        onChangeText={setCode}
                        isInvalid={invalidCode}
                    />

                    <FormControl mb={2} isInvalid={invalidCode}>
                        <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                            Código inválido.
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <Button
                        mt={2}
                        mb={3}
                        title="Validar"
                        w="full"
                        variant="green"
                        onPress={checkCode}
                        isLoading={false}
                    />

                    <Button
                        mb={6}
                        title="Reenviar código de verificação"
                        w="full"
                        variant="gray"
                        onPress={() => { }}
                        isLoading={false}
                    />
                </>
            }

            {resetPassword &&
                <>
                    <Heading color="gray.600" fontSize="xl" mb={6} w="full">
                        Resetar senha
                    </Heading>

                    <Input
                        mb={4}
                        placeholder="Senha"
                        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                        secureTextEntry
                        onChangeText={setPassword}
                        isInvalid={(areBlankFields && !password) || invalidPasswordFormat || differentPasswords}
                    />
                    <Input
                        placeholder="Confirmar senha"
                        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                        isInvalid={(areBlankFields && !confirmPassword) || invalidPasswordFormat || differentPasswords}
                    />

                    <FormControl mb={2} isInvalid={areBlankFields || invalidPasswordFormat || differentPasswords}>
                        <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                            {invalidMessage}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <Button
                        mt={2}
                        mb={3}
                        title="Mudar senha"
                        w="full"
                        variant="green"
                        onPress={handleChangePassword}
                        isLoading={isChanging}
                    />
                </>
            }

            <HStack w="full" alignItems="center" justifyContent="center" position="absolute" bottom={10}>
                <Text color="gray.400" fontSize="md" >Já possui uma conta? </Text>
                <Pressable onPress={() => navigation.navigate('signin')}>
                    <Text color="green.700" fontSize="md" fontFamily="Roboto_500Medium">Entrar</Text>
                </Pressable>
            </HStack>

            <Alert
                title="Senha mudada com sucesso!"
                acceptButtonText="Voltar"
                isOpen={confirmChangePassword}
                onAccept={() => navigation.navigate('signin')}
            />

            <AlertPopup
                status="error"
                title="Tente novamente mais tarde!"
                description={error}
                onClose={() => setError("")}
                isOpen={error !== ""}
            />

        </VStack>
    )
}