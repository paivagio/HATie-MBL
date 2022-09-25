import React, { useEffect, useState } from 'react';
import { Heading, HStack, Switch, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import userService from '../services/userService';

import { UserPreferences } from '../@types';

import { StoreState } from '../store/store';
import { useDispatch, useSelector } from '../hooks';
import { unauthenticate } from '../store/reducers/authenticationReducer';

export function Preferences() {
    const store = useSelector((state: StoreState) => state.auth);
    const userId = store.user?.id;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [confirmDeleteAccountIntention, setConfirmDeleteAccountIntention] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [sound, setSound] = useState<boolean>(false);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            userService.getUser(userId)
                .then(response => {
                    const preferences = response.data.preferences;
                    setNotifications(preferences.notifications);
                    setDarkMode(preferences.darkmode);
                    setSound(preferences.sound);
                    setIsLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }
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
                setError(error.message);
            });
    };

    const deleteAccount = () => {
        setConfirmDeleteAccountIntention(false);
        setIsDeleting(true);
        userService.deleteUser(userId)
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
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={3}>
                        Preferências
                    </Heading>

                    <VStack mx={6}>
                        <HStack alignItems="center" justifyContent="space-between" mb={2}>
                            <Text color="gray.400" fontSize="md" fontFamily="Roboto_500Medium">
                                Notificações
                            </Text>

                            <Switch
                                size="md"
                                colorScheme="emerald"
                                value={notifications}
                                onToggle={() => setNotifications(!notifications)}
                            />
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between" mb={2}>
                            <Text color="gray.400" fontSize="md" fontFamily="Roboto_500Medium">
                                Modo escuro
                            </Text>

                            <Switch
                                size="md"
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
                                size="md"
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

                    <Button
                        title="Excluir conta"
                        variant="red"
                        w="full"
                        onPress={() => setConfirmDeleteAccountIntention(true)}
                        mt={200}
                        isLoading={isDeleting}
                    />

                </VStack>

                <Menu variant="blank" preferences />

                <Alert
                    title="Deseja realmente excluir sua conta?"
                    description="Todas as informações vinculadas à conta serão excluídas. Isso inclui instituições e seus dados."
                    cancelButtonText="Cancelar"
                    acceptButtonText="Excluir"
                    acceptButtonColor="red"
                    isOpen={confirmDeleteAccountIntention}
                    onAccept={() => deleteAccount()}
                    onCancel={() => setConfirmDeleteAccountIntention(false)}
                />

                <Alert
                    title="Conta excluída com sucesso!"
                    acceptButtonText="Sair"
                    isOpen={confirmDelete}
                    onAccept={() => dispatch(unauthenticate())}
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