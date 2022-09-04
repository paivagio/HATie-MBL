import { Heading, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { IdentificationBadge } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import institutionService from '../services/institutionService';

type RouteParams = {
    institutionId: string;
};

export function ManageInstitution() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            institutionService.getInstitution(institutionId)
                .then((response) => {
                    setName(response.data.name);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        console.log('error message: ', error.message);
                    } else {
                        console.log('unexpected error: ', error);
                    }
                    setIsLoading(false);
                });
        }, [])
    );

    const updateInstitution = () => {
        setIsLoading(true);
        institutionService.patchInstitution(institutionId, name)
            .then(() => {
                navigation.goBack();
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
                            value={name}
                        />

                        <Button
                            title="Membros"
                            variant="green"
                            w="full"
                            mb={2}
                            onPress={() => navigation.navigate("manageMembers", { institutionId })}
                        />

                        <Button
                            title="Pacientes"
                            variant="cyan"
                            w="full"
                            onPress={() => navigation.navigate("managePatients", { institutionId })}
                        />

                    </VStack>

                    <Button
                        title="Salvar"
                        variant="orange"
                        w="153"
                        ml="160"
                        mt={8}
                        onPress={() => updateInstitution()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}