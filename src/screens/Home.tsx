import React, { useEffect, useState } from 'react';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { SmileyMeh, EnvelopeSimple, EnvelopeSimpleOpen, SignOut } from 'phosphor-react-native';
import Logo from '../assets/logo_text_dark.svg';

import { Filter } from '../components/Filter';
import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Loading } from '../components/Loading';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import userService from '../services/userService';

import { Status, User } from '../@types';

import { StoreState } from '../store/store';
import { useDispatch, useSelector } from '../hooks';
import { unauthenticate } from '../store/reducers/authenticationReducer';

export function Home() {
    const authStore = useSelector((state: StoreState) => state.auth);
    const userId = authStore.user?.id;
    const isAdmin = authStore.user?.isAdmin;

    const [userData, setUserData] = useState<User>(null);
    const [selectedFilter, setSelectedFilter] = useState<'first' | 'second'>('first');
    const [institutions, setInstitutions] = useState<ListItemProps[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [checkLogoutIntention, setCheckLogoutIntention] = useState<boolean>(false);

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
                    setError(error.message);
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
                    owned: institution.ownerId === userId,
                    memberId: null,
                    memberPermissions: null
                };
            });

            const participatingInstitutions = userData.Member.map<ListItemProps>(membership => {
                if (membership.invitation === Status.ACCEPTED) {
                    const institution = membership.Institution;
                    return {
                        id: institution.id,
                        name: institution.name,
                        members: institution._count.Member,
                        owned: institution.ownerId === userId,
                        memberId: membership.id,
                        memberPermissions: membership.authorizations
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

    const handleOpenDetails = (institutionId: string, isOwner: boolean, memberId?: string, memberPermissions?: number) => {
        navigation.navigate('institutionDetails', { institutionId, isOwner, memberId, memberPermissions });
    }

    const signOut = () => dispatch(unauthenticate());

    return (
        <>
            {isLoading
                ? <Loading />
                : <VStack flex={1} bg="background">
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
                            onPress={() => setCheckLogoutIntention(true)}
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
                            renderItem={({ item }) => <ListItem data={item} variant="institution" onPress={() => handleOpenDetails(item.id, item.owned, item.memberId, item.memberPermissions)} />}
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

                    <Menu variant={isAdmin ? "institution" : "blank"} onPress={() => { isAdmin ? handleNewInstitution() : {} }} home />

                    <Alert
                        title="Deseja realmente sair?"
                        description=""
                        acceptButtonText="Sim"
                        cancelButtonText="Não"
                        isOpen={checkLogoutIntention}
                        onCancel={() => setCheckLogoutIntention(false)}
                        onAccept={signOut}
                    />

                    <AlertPopup
                        status="error"
                        title="Erro ao carregar dados do usuário!"
                        description={error}
                        onClose={() => setError("")}
                        isOpen={error !== ""}
                    />

                </VStack>}
        </>

    );
}