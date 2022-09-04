import { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { SmileyMeh, EnvelopeSimple, EnvelopeSimpleOpen } from 'phosphor-react-native';

import Logo from '../assets/logo_text_dark.svg';
import { Filter } from '../components/Filter';
import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';

import axios from 'axios';
import userService from '../services/userService';

import { Status, User } from '../@types';

import { unauthenticate } from '../store/reducers/authenticationReducer';
import { useDispatch, useSelector } from '../hooks';
import { StoreState } from '../store/store';
import { Loading } from '../components/Loading';
import React from 'react';

export function Home() {
    const { id: userId, isAdmin } = useSelector((state: StoreState) => state.auth.user);
    const [userData, setUserData] = useState<User>(null);
    const [selectedFilter, setSelectedFilter] = useState<'first' | 'second'>('first');
    const [institutions, setInstitutions] = useState<ListItemProps[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const filteredInstitutions = institutions.length === 0 ? [] : institutions.filter((item: ListItemProps) => item.owned === (selectedFilter === 'first'));
    const pendingInvites = userData ? userData.Member.filter(member => member.invitation === "PENDING").length > 0 : false;

    const navigation = useNavigation();
    const { colors } = useTheme();
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            userService.getUser(userId)
                .then(response => {
                    setUserData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    if (axios.isAxiosError(error)) {
                        console.log('error message: ', error.message);
                    } else {
                        console.log('unexpected error: ', error);
                    };
                    setLoading(false);
                });
        }, [])
    );

    useEffect(() => {
        if (userData) {
            const userInstitutions = userData.Institution.map<ListItemProps>(institution => {
                return {
                    id: institution.id,
                    name: institution.name,
                    members: institution._count.Member,
                    owned: institution.ownerId === userId
                };
            });

            const participatingInstitutions = userData.Member.map<ListItemProps>(membership => {
                if (membership.invitation === Status.ACCEPTED) {
                    const institution = membership.Institution;
                    return {
                        id: institution.id,
                        name: institution.name,
                        members: institution._count.Member,
                        owned: institution.ownerId === userId
                    };
                }
                return null;
            }).filter(item => item !== null);

            setInstitutions([...userInstitutions, ...participatingInstitutions]);
        }
    }, [userData]);

    const handleNewInstitution = () => {
        navigation.navigate('newInstitution', { ownerId: userId });
    }

    const handleOpenDetails = (institutionId: string) => {
        navigation.navigate('institutionDetails', { institutionId });
    }

    const signOut = () => dispatch(unauthenticate());

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <HStack
                    w="full"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    bg="white"
                    pt={12}
                    pb={5}
                    px={6}
                >
                    <Logo width={100} height={40} />

                    <IconButton
                        icon={<SignOut size={26} color={colors.gray[300]} weight="bold" />}
                        onPress={signOut}
                    />
                </HStack>

                <VStack flex={1} px={6}>
                    <HStack w="full" mt={2} mb={4} justifyContent="space-between" alignItems="center">
                        <Heading color="gray.600" fontSize="lg">
                            Solicitações
                        </Heading>

                        <IconButton
                            icon={!pendingInvites
                                ? <EnvelopeSimpleOpen size={28} color={colors.gray[300]} />
                                : <VStack>
                                    <EnvelopeSimple size={28} color={colors.gray[300]} />
                                    <Circle
                                        bg="orange.700"
                                        h={3} w={3}
                                        position="absolute"
                                        right={-2} />
                                </VStack>

                            }
                            onPress={() => navigation.navigate('invitations')}
                        />
                    </HStack>

                    <HStack space={3} mb={8}>
                        <Filter
                            title="minhas"
                            onPress={() => setSelectedFilter('first')}
                            isActive={selectedFilter === 'first'}
                        />

                        <Filter
                            title="participantes"
                            onPress={() => setSelectedFilter('second')}
                            isActive={selectedFilter === 'second'}
                        />
                    </HStack>

                    <FlatList
                        data={filteredInstitutions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ListItem data={item} variant="institution" onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <SmileyMeh color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não {'\n'}
                                    {selectedFilter === 'first'
                                        ? isAdmin ? 'possui' : 'possui permissão para criar '
                                        : 'participa de'} instituições
                                </Text>
                            </Center>
                        )}
                    />
                </VStack>

                <Menu variant={isAdmin ? "institution" : "blank"} onPress={() => handleNewInstitution()} home />
            </VStack>}
        </>

    );
}