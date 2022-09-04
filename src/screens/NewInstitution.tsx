import { Heading, HStack, Icon, KeyboardAvoidingView, Switch, Text, useTheme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import institutionService from '../services/institutionService';
import { Input } from '../components/Input';
import { IdentificationBadge } from 'phosphor-react-native';

type RouteParams = {
    ownerId: string;
};

export function NewInstitution() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { ownerId } = route.params as RouteParams;

    const addInstitution = () => {
        setIsLoading(true);
        institutionService.postInstitution(ownerId, name)
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
                        Nova instituição
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            bg="white"
                        />
                    </VStack>

                    <Button
                        title="Criar"
                        variant="green"
                        w="153"
                        ml="160"
                        mt={5}
                        onPress={() => addInstitution()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}