import { Heading, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Article, IdentificationBadge } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';

import groupService from '../services/groupService';

type RouteParams = {
    groupId: string;
};

export function ManageGroup() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("")

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { groupId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            groupService.getGroup(groupId)
                .then((response) => {
                    setName(response.data.name);
                    setDescription(response.data.description);
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

    const updateGroup = () => {
        setIsLoading(true);
        groupService.patchGroup(groupId, name, description)
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
                        Gerenciar grupo
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setName}
                            mb={2}
                            bg="white"
                            value={name}
                        />

                        <Input
                            placeholder="Descrição"
                            InputLeftElement={<Icon as={<Article color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setDescription}
                            mb={3}
                            bg="white"
                            value={description}
                        />

                        <Button
                            title="Responsáveis"
                            variant="green"
                            w="full"
                            onPress={() => navigation.navigate('manageGroupMembers', { groupId })}
                        />

                    </VStack>

                    <Button
                        title="Salvar"
                        variant="darkblue"
                        w="153"
                        ml="160"
                        mt={8}
                        onPress={() => updateGroup()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}