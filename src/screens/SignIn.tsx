import React, { useState } from 'react';
import { VStack, Heading, Icon, useTheme, FormControl, HStack, Text, Pressable, Switch, Checkbox } from 'native-base';
import { Envelope, Key, WarningCircle } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';

import Logo from '../assets/logo_text_dark.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AlertPopup } from '../components/AlertPopup';

import authenticationService from '../services/authenticationService';

import { authenticate } from '../store/reducers/authenticationReducer';
import { useDispatch } from '../hooks';

export function SignIn() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInvalidMessage, setIsInvalidMessage] = useState<string>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    function handleSignIn() {
        if (!email || !password) {
            setIsInvalidMessage("Favor preencher todos os campos.");
            return;
        }
        setIsInvalidMessage(undefined);
        setIsLoading(true);
        authenticationService.postAuthentication(email, password)
            .then((response) => {
                const { token, user } = response.data;
                dispatch(authenticate({ token, user }));
            }).catch((error: AxiosError) => {
                if (error.message.includes("401")) setIsInvalidMessage("Usuário e/ou senha inválidos.");
                else setError(error.message);
                setIsLoading(false);
            });
    }

    return (
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
            <Logo width={200} height={81} />

            <Heading color="gray.600" fontSize="xl" mt={20} mb={6} w="full">
                Acesse sua conta
            </Heading>

            <FormControl mb={8} isInvalid={isInvalidMessage ? true : false}>
                <Input
                    mb={4}
                    placeholder="E-mail"
                    InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                    onChangeText={setEmail}
                />
                <Input
                    mb={4}
                    placeholder="Senha"
                    InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                    secureTextEntry
                    onChangeText={setPassword}
                />

                <Checkbox
                    value="one"
                    fontSize="sm"
                    onChange={setRememberMe}
                    isInvalid={false}
                >
                    Lembre-se de mim
                </Checkbox>

                <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                    {isInvalidMessage}
                </FormControl.ErrorMessage>
            </FormControl>



            <Button title="Entrar" w="full" variant="green" onPress={handleSignIn} isLoading={isLoading} />

            <HStack mt={24} w="full" alignItems="center" justifyContent="center">
                <Text color="gray.400" fontSize="md" >Não possui uma conta ainda? </Text>
                <Pressable onPress={() => navigation.navigate('signup')}>
                    <Text color="green.700" fontSize="md" fontFamily="Roboto_500Medium">Cadastre-se</Text>
                </Pressable>
            </HStack>
            <HStack mt={2} w="full" alignItems="center" justifyContent="center">
                <Text color="gray.400" fontSize="md" >Esqueceu sua senha? </Text>
                <Pressable onPress={() => navigation.navigate('resetPassword')}>
                    <Text color="green.700" fontSize="md" fontFamily="Roboto_500Medium">Resetar senha</Text>
                </Pressable>
            </HStack>

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