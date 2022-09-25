import React, { useEffect, useState } from 'react';
import { Center, FlatList, Heading, Text, useTheme, VStack } from 'native-base';

import { MoonStars } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Invite } from '../components/Invite';
import { AlertPopup } from '../components/AlertPopup';

import userService from '../services/userService';
import memberService from '../services/memberService';

import { Member, Status } from '../@types';

import { StoreState } from '../store/store';
import { useSelector } from '../hooks';

export function Invitations() {
    const { id: userId } = useSelector((state: StoreState) => state.auth.user);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invitations, setInvitations] = useState<Member[]>([]);
    const [error, setError] = useState<string>("");

    const pendingInvitations = isLoading ? [] : invitations.filter(invitation => invitation.invitation === 'PENDING');

    const { colors } = useTheme();

    useEffect(() => {
        userService.getUser(userId)
            .then(response => {
                setInvitations(response.data.Member);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const updateInvite = (id: string, accepted: boolean) => {
        const invitationStatus = (accepted ? 'ACCEPTED' : 'REJECTED') as Status;

        memberService.patchMember(id, null, invitationStatus)
            .then(() => {
                const updatedInviteIndex = invitations.findIndex(invite => invite.id === id);
                const updatedInvitations = [...invitations];
                updatedInvitations[updatedInviteIndex].invitation = invitationStatus
                setInvitations(updatedInvitations);
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={3}>
                        Convites
                    </Heading>

                    <FlatList
                        data={pendingInvitations}
                        mx={3}
                        keyExtractor={item => item.id}
                        renderItem={
                            ({ item }) =>
                                <Invite
                                    data={item}
                                    onAccept={(id: string) => updateInvite(id, true)}
                                    onDecline={(id: string) => updateInvite(id, false)}
                                />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <MoonStars color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Sem convites pendentes
                                </Text>
                            </Center>
                        )}
                    />

                </VStack>

                <Menu variant="blank" />

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