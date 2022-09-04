import { Center, Heading, Icon, useTheme, VStack, Text, FlatList } from 'native-base';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MagnifyingGlass, MoonStars } from 'phosphor-react-native';
import axios from 'axios';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';
import { SimpleListItem } from '../components/SimpleListItem';

import { Member } from '../@types';
import memberService from '../services/memberService';

type RouteParams = {
    institutionId: string;
};

export function ManageMembers() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [members, setMembers] = useState<Member[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const invitedMembers = members.filter(member => member.invitation === "PENDING");
    const realMembers = members.filter(member => member.invitation === "ACCEPTED");
    const filteredMembers = search ? realMembers.filter(member => member.User.fullname.includes(search)) : realMembers;

    useFocusEffect(
        React.useCallback(() => {
            memberService.getMembers(institutionId)
                .then(response => {
                    setMembers(response.data.sort((a, b) => a.User.fullname.localeCompare(b.User.fullname)));
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

    const handleNewMember = () => {
        navigation.navigate('newMember', { institutionId });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={360} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Membros
                    </Heading>

                    <VStack mx={6}>
                        <Input
                            placeholder="Nome"
                            InputLeftElement={<Icon as={<MagnifyingGlass color={colors.gray[300]} />} ml={4} />}
                            onChangeText={setSearch}
                            mb={4}
                            bg="white"
                            isDisabled={members.length === 0}
                        />

                        <FlatList
                            data={filteredMembers}
                            mx={3}
                            h={450}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <SimpleListItem data={item} variant="member" onPress={() => navigation.navigate("editPatient", { patientId: item.id })} selectedId="" />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <MoonStars color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Não há membros{'\n'}vinculados à instituição
                                    </Text>
                                </Center>
                            )}
                        />
                    </VStack>

                </VStack>

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Convites
                    </Heading>

                    <VStack mx={6}>

                        <FlatList
                            data={invitedMembers}
                            mx={3}
                            h={450}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <SimpleListItem data={item} variant="memberPending" onPress={() => { }} selectedId="" />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <MoonStars color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Não há convites pendentes
                                    </Text>
                                </Center>
                            )}
                        />
                    </VStack>

                </VStack>

                <Menu variant="member" onPress={() => handleNewMember()} />

            </VStack>}
        </>
    );
}