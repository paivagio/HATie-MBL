import { Center, Heading, Icon, useTheme, VStack, Text, FlatList } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { MagnifyingGlass, MoonStars } from 'phosphor-react-native';
import axios from 'axios';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { SimpleListItem } from '../components/SimpleListItem';

import { GroupMember } from '../@types';

import groupMemberService from '../services/groupMemberService';

type RouteParams = {
    groupId: string;
};

export function ManageGroupMembers() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

    const { colors } = useTheme();
    const route = useRoute();

    const { groupId } = route.params as RouteParams;

    const filteredGroupMembers = search ? groupMembers.filter(groupMember => groupMember.Member.User.fullname.includes(search)) : groupMembers;

    useFocusEffect(
        React.useCallback(() => {
            groupMemberService.getGroupMembers(groupId)
                .then(response => {
                    setGroupMembers(response.data.sort((a, b) => a.Member.User.fullname.localeCompare(b.Member.User.fullname)));
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

    return (
        <>
            {isLoading
                ? <Loading />
                : <VStack flex={1} bg="background">
                    <Header title="" mr={360} />

                    <VStack flex={1} px={6}>
                        <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                            Responsáveis
                        </Heading>

                        <VStack mx={6}>
                            <Input
                                placeholder="Nome"
                                InputLeftElement={<Icon as={<MagnifyingGlass color={colors.gray[300]} />} ml={4} />}
                                onChangeText={setSearch}
                                mb={4}
                                bg="white"
                                isDisabled={groupMembers.length === 0}
                            />

                            <FlatList
                                data={filteredGroupMembers}
                                mx={3}
                                h={450}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <SimpleListItem data={item} variant="member" onPress={() => { }} selectedId="" />}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                ListEmptyComponent={() => (
                                    <Center>
                                        <MoonStars color={colors.gray[300]} size={40} />
                                        <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                            Não há membros{'\n'}vinculados ao grupo
                                        </Text>
                                    </Center>
                                )}
                            />
                        </VStack>

                    </VStack>

                    <Menu variant="blank" onPress={() => { }} />

                </VStack>}
        </>
    );
}