import { Center, FlatList, Heading, HStack, IconButton, Switch, Text, useTheme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';

import userService from '../services/userService';
import { Member, Status } from '../@types';

import { useSelector } from '../hooks';
import { StoreState } from '../store/store';
import { Buildings, Check, MoonStars, X } from 'phosphor-react-native';
import { Invite } from '../components/Invite';
import memberService from '../services/memberService';

export function Invitations() {
    const { id: userId } = useSelector((state: StoreState) => state.auth.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invitations, setInvitations] = useState<Member[]>([]);

    const pendingInvitations = isLoading ? [] : invitations.filter(invitation => invitation.invitation === 'PENDING');

    const { colors } = useTheme();

    useEffect(() => {
        userService.getUser(userId)
            .then(response => {
                setInvitations(response.data.Member);
                setIsLoading(false);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                };
                setIsLoading(false);
            });
    }, []);

    const updateInvite = (id: string, accepted: boolean) => {
        const invitationStatus = (accepted ? 'ACCEPTED' : 'REJECTED') as Status;

        memberService.patchMember(id, null, invitationStatus)
            .then(() => {
                const updatedInviteIndex = invitations.findIndex(invite => invite.id === id);
                const updatedInvitations = invitations;
                updatedInvitations[updatedInviteIndex].invitation = invitationStatus
                setInvitations(updatedInvitations);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                };
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
            </VStack>}
        </>
    );
}