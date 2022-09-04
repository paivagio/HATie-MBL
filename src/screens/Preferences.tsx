import { Heading, HStack, Switch, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';

import userService from '../services/userService';
import { User, UserPreferences } from '../@types';

import { useSelector } from '../hooks';
import { StoreState } from '../store/store';

export function Preferences() {
    const { id: userId } = useSelector((state: StoreState) => state.auth.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [sound, setSound] = useState<boolean>(false);

    const navigation = useNavigation();

    useEffect(() => {
        userService.getUser(userId)
            .then(response => {
                const preferences = response.data.preferences;
                setNotifications(preferences.notifications);
                setDarkMode(preferences.darkmode);
                setSound(preferences.sound);
                setIsLoading(false);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                };
                setIsLoading(false);
            });
    }, []);

    const updatePreferences = () => {
        const newPreferences = {
            notifications: notifications,
            darkmode: darkMode,
            sound: sound
        } as UserPreferences;

        userService.patchUser(userId, null, null, null, newPreferences)
            .then(() => {
                navigation.navigate('home');
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
            });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={3}>
                        Preferências
                    </Heading>

                    <VStack mx={6}>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text color="gray.400" fontSize="md" fontFamily="Roboto_500Medium">
                                Notificações
                            </Text>

                            <Switch
                                size="lg"
                                colorScheme="emerald"
                                value={notifications}
                                onToggle={() => setNotifications(!notifications)}
                            />
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text color="gray.400" fontSize="md" fontFamily="Roboto_500Medium">
                                Modo escuro
                            </Text>

                            <Switch
                                size="lg"
                                colorScheme="emerald"
                                value={darkMode}
                                onToggle={() => setDarkMode(!darkMode)}
                            />
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text color="gray.400" fontSize="md" fontFamily="Roboto_500Medium">
                                Som
                            </Text>

                            <Switch
                                size="lg"
                                colorScheme="emerald"
                                value={sound}
                                onToggle={() => setSound(!sound)}
                            />
                        </HStack>

                    </VStack>

                    <Button
                        title="Salvar"
                        variant="green"
                        w="153"
                        ml="160"
                        mt={5}
                        onPress={() => updatePreferences()}
                    />

                </VStack>

                <Menu variant="blank" preferences />
            </VStack>}
        </>
    );
}