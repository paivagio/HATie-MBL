import React, { useState } from 'react';
import { VStack, Heading, Icon, useTheme, FormControl, HStack, Text, Pressable, Switch, Checkbox } from 'native-base';
import { Envelope, IdentificationBadge, Key, WarningCircle } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

import axios from 'axios';
import userService from '../services/userService';
import { UserPreferences } from '../@types';

const defaultPreferences: UserPreferences = {
    notifications: false,
    darkmode: false,
    sound: true
}

export function SignUp() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [areBlankFields, setAreBlankFields] = useState<boolean>(false);
    const [invalidPasswordFormat, setInvalidPasswordFormat] = useState<boolean>(false);
    const [differentePasswords, setDifferentePasswords] = useState<boolean>(false);
    const [userAlreadyRegistered, setUserAlreadyRegistered] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [termsOfService, setTermsOfService] = useState<boolean>(false);

    const invalidMessage = invalidPasswordFormat
        ? "Senha precisa possuir:\n - 01 Letra maiúscula\n - 01 Letra minúscula\n - 01 Caracter especial\n - 01 Número"
        : areBlankFields
            ? "Favor preencher todos os campos."
            : differentePasswords
                ? "Senhas precisam ser iguais."
                : userAlreadyRegistered
                    ? "Já existe um usuário cadastrado com este e-mail."
                    : "";

    function handleSignUp() {
        setUserAlreadyRegistered(false);
        if (!name || !email || !password || !confirmPassword) {
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
            setDifferentePasswords(true);
            return;
        }
        setDifferentePasswords(false);

        setIsLoading(true);
        userService.postUser(name, email, password, true, defaultPreferences)
            .then(() => {
                navigation.navigate('signin');
            }).catch((error) => {
                setUserAlreadyRegistered(true);
                setIsLoading(false);
            });
    }

    return (
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={20}>

            <Heading color="gray.600" fontSize="xl" mb={6} w="full">
                Crie sua conta
            </Heading>


            <Input
                mb={4}
                placeholder="Nome completo"
                InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                onChangeText={setName}
                isInvalid={areBlankFields && !name}
            />
            <Input
                mb={4}
                placeholder="E-mail"
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
                isInvalid={(areBlankFields && !email) || userAlreadyRegistered}
            />
            <Input
                mb={4}
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
                isInvalid={(areBlankFields && !password) || invalidPasswordFormat || differentePasswords}
            />
            <Input
                placeholder="Confirmar senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setConfirmPassword}
                isInvalid={(areBlankFields && !confirmPassword) || invalidPasswordFormat || differentePasswords}
            />

            <FormControl mb={2} isInvalid={invalidMessage && true}>
                <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                    {invalidMessage}
                </FormControl.ErrorMessage>
            </FormControl>

            <HStack alignItems="center" justifyContent="space-between" w="full">
                <Text color="gray.400" fontSize="md">
                    Termos de Uso
                </Text>

                <Switch
                    size="sm"
                    colorScheme="emerald"
                    value={termsOfService}
                    onToggle={() => setTermsOfService(!termsOfService)}
                />
            </HStack>

            <HStack alignItems="center" justifyContent="space-between" w="full">
                <Text color="gray.400" fontSize="md">
                    Conta de administrador
                </Text>

                <Switch
                    size="sm"
                    colorScheme="emerald"
                    value={isAdmin}
                    onToggle={() => setIsAdmin(!isAdmin)}
                />
            </HStack>

            <Text color="gray.400" fontSize="xs" w="full">
                Contas de administrador são submetidas a uma tabela de preços diferente de contas normais. Prossiga somente se realmente pretende criar e administrar instituições.
            </Text>


            <Button mt={6} mb={6} title="Cadastrar" w="full" variant="green" onPress={handleSignUp} isLoading={isLoading} />

            <HStack w="full" alignItems="center" justifyContent="center" position="absolute" bottom={10}>
                <Text color="gray.400" fontSize="md" >Já possui uma conta? </Text>
                <Pressable onPress={() => navigation.navigate('signin')}>
                    <Text color="green.700" fontSize="md" fontFamily="Roboto_500Medium">Entrar</Text>
                </Pressable>
            </HStack>

        </VStack>
    )
}