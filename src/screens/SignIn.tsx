import React, { useEffect, useState } from 'react';
import { VStack, Heading, Icon, useTheme, FormControl } from 'native-base';
import { Envelope, Key, WarningCircle } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Logo from '../assets/logo_text_dark.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useDispatch, useSelector } from '../hooks';
import { StoreState } from '../store/store';
import authenticationService from '../services/authenticationService';
import axios, { AxiosResponse } from 'axios';
import { authenticate } from '../store/reducers/authenticationReducer';

export function SignIn() {
    const dispatch = useDispatch();
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInvalidMessage, setIsInvalidMessage] = useState<string>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            }).catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                };
                setIsInvalidMessage("Usuário e/ou senha inválidos.");
                setIsLoading(false);
            });
    }

    return (
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
            <Logo width={200} height={81} />

            <Heading color="gray.600" fontSize="xl" mt={20} mb={6}>
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
                    placeholder="Senha"
                    InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                    {isInvalidMessage}
                </FormControl.ErrorMessage>
            </FormControl>


            <Button title="Entrar" w="full" variant="green" onPress={handleSignIn} isLoading={isLoading} />
        </VStack>
    )
}