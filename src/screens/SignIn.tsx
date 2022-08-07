import { useEffect, useState } from 'react';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Logo from '../assets/logo_text_dark.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SignIn() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [name, setName] = useState('João');
    const [password, setPassword] = useState('');

    function handleSignIn() {
        navigation.navigate('home');
    }

    return (
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
            <Logo width={200} height={81} />

            <Heading color="gray.600" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                mb={4}
                placeholder="E-mail"
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setName}
            />

            <Input
                mb={8}
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button title="Entrar" w="full" variant="green" onPress={handleSignIn} />
        </VStack>
    )
}