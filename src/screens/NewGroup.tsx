import { Heading, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Article, IdentificationBadge } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';


import groupService from '../services/groupService';

type RouteParams = {
    institutionId: string;
};

export function NewGroup() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const addGroup = () => {
        setIsLoading(true);
        groupService.postGroup(institutionId, name, description)
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
                        />

                        <Input
                            placeholder="Descrição (opcional)"
                            InputLeftElement={<Icon as={<Article color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setDescription}
                            bg="white"
                        />
                    </VStack>

                    <Button
                        title="Criar"
                        variant="green"
                        w="153"
                        ml="160"
                        mt={5}
                        onPress={() => addGroup()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}