import React, { useEffect, useState } from 'react';
import { Center, FlatList, Heading, HStack, Text, useTheme, VStack } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { MoonStars, ShieldCheckered, UserCircle } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { SimpleListItem } from '../components/SimpleListItem';
import { AlertPopup } from '../components/AlertPopup';
import { Alert } from '../components/Alert';

import memberService from '../services/memberService';
import institutionService from '../services/institutionService';
import groupMemberService from '../services/groupMemberService';

import { Group, GroupMember, Member } from '../@types';

import { toBrazilianFormat } from './NewPatient';
import { leaveNumbersOnly } from './EditPatient';

type RouteParams = {
    memberId: string;
    institutionId: string;
};

type AccessLevelGroup = GroupMember & {
    name: string;
    groupId: string;
}

export function EditMember() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [confirmPromoteUser, setConfirmPromoteUser] = useState<boolean>(false);
    const [confirmDepromoteUser, setConfirmDepromoteUser] = useState<boolean>(false);
    const [confirmRemoveUserIntention, setConfirmRemoveUserIntention] = useState<boolean>(false);
    const [confirmRemoveUser, setConfirmRemoveUser] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [memberData, setMemberData] = useState<Member>();
    const [institutionGroups, setInstitutionGroups] = useState<Group[]>();
    const [accessLevelGroups, setAccessLevelGroups] = useState<AccessLevelGroup[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { memberId, institutionId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            memberService.getMember(memberId)
                .then(response => {
                    setMemberData(response.data);
                    institutionService.getInstitution(institutionId)
                        .then(response => {
                            setInstitutionGroups(response.data.Group);
                            setIsLoading(false);
                        })
                        .catch((error) => {
                            setError(error.message);
                            setIsLoading(false);
                        });
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });

        }, [])
    );

    useEffect(() => {
        if (institutionGroups && institutionGroups.length > 0) {
            const accessInstances = institutionGroups.map<AccessLevelGroup>(group => {
                const membership = memberData.GroupMember.find(groupMember => groupMember.groupId === group.id)
                return membership
                    ? {
                        name: group.name,
                        groupId: group.id,
                        ...membership
                    } as AccessLevelGroup
                    : {
                        name: group.name,
                        groupId: group.id
                    } as AccessLevelGroup
            });
            setAccessLevelGroups(accessInstances);
        }
    }, [institutionGroups]);

    const addMembership = (groupId: string) => {
        groupMemberService.postGroupMember(groupId, memberId, 1)
            .then(response => {
                const index = accessLevelGroups.findIndex(accessGroup => accessGroup.groupId === groupId);
                const updatedAccessLevelGroups = accessLevelGroups;
                updatedAccessLevelGroups[index] = {
                    ...accessLevelGroups[index],
                    ...response.data
                }
                setAccessLevelGroups(updatedAccessLevelGroups);
                setReload(!reload);
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    const upgradeMembership = (groupMemberId: string, currentAccessLevel: number) => {
        if (currentAccessLevel === 111) return;
        const newAccessLevel = currentAccessLevel === 1 ? 11 : 111;

        groupMemberService.patchGroupMember(groupMemberId, newAccessLevel)
            .then((response) => {
                const index = accessLevelGroups.findIndex(accessGroup => accessGroup.id === groupMemberId);
                const updatedAccessLevelGroups = [...accessLevelGroups];
                updatedAccessLevelGroups[index] = {
                    ...accessLevelGroups[index],
                    ...response.data
                }
                setAccessLevelGroups(updatedAccessLevelGroups);
                setReload(!reload);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const downgradeMembership = (groupMemberId: string, currentAccessLevel: number) => {
        if (currentAccessLevel === 1) return;
        const newAccessLevel = currentAccessLevel === 111 ? 11 : 1;

        groupMemberService.patchGroupMember(groupMemberId, newAccessLevel)
            .then((response) => {
                const index = accessLevelGroups.findIndex(accessGroup => accessGroup.id === groupMemberId);
                const updatedAccessLevelGroups = [...accessLevelGroups];
                updatedAccessLevelGroups[index] = {
                    ...accessLevelGroups[index],
                    ...response.data
                }
                setAccessLevelGroups(updatedAccessLevelGroups);
                setReload(!reload);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const removeMembership = (groupMemberId: string) => {
        groupMemberService.deleteGroupMember(groupMemberId)
            .then(() => {
                const index = accessLevelGroups.findIndex(accessGroup => accessGroup.id === groupMemberId);
                const updatedAccessLevelGroups = accessLevelGroups;
                updatedAccessLevelGroups[index] = {
                    ...accessLevelGroups[index],
                    id: undefined
                }
                setAccessLevelGroups(updatedAccessLevelGroups);
                setReload(!reload);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const removeMember = () => {
        setIsRemoving(true);
        setConfirmRemoveUserIntention(false);
        memberService.deleteMember(memberId)
            .then(() => {
                setConfirmRemoveUser(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsRemoving(false);
            });
    };

    const promoteMember = () => {
        memberService.patchMember(memberId, 111)
            .then((response) => {
                setMemberData({ ...memberData, ...response.data });
                setConfirmPromoteUser(true);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const depromoteMember = () => {
        memberService.patchMember(memberId, 1)
            .then((response) => {
                setMemberData({ ...memberData, ...response.data });
                setConfirmDepromoteUser(true);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Gerenciar membro
                    </Heading>

                    <VStack mx={6}>
                        <HStack w="full" >
                            <UserCircle color={colors.green[700]} size={95} />
                            <VStack w="200" flex={1} ml={1}>
                                <HStack alignItems="center">
                                    <Text color="gray.600" fontSize="lg" mt={2} mr={2}>
                                        {memberData.User.fullname}
                                    </Text>
                                    {memberData.authorizations === 111
                                        ? <ShieldCheckered weight="fill" color={colors.blue[500]} size={22} />
                                        : <></>}
                                </HStack>

                                <Text color="gray.300" fontSize="sm" mt={2}>
                                    Membro desde de {toBrazilianFormat(leaveNumbersOnly(memberData.acceptedAt))}
                                </Text>
                            </VStack>
                        </HStack>

                        <Button
                            title={memberData.authorizations === 111 ? "Retirar direitos de moderador" : "Promover a moderador"}
                            variant="white"
                            w="full"
                            mt={5}
                            onPress={() => { memberData.authorizations === 111 ? depromoteMember() : promoteMember() }}
                        />

                        <Button
                            title="Remover da instituição"
                            variant="red"
                            w="full"
                            mt={5}
                            onPress={() => setConfirmRemoveUserIntention(true)}
                            isLoading={isRemoving}
                        />

                        <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                            Acesso
                        </Heading>

                        <FlatList
                            data={accessLevelGroups}
                            mx={0}
                            h={450}
                            keyExtractor={item => item.name}
                            renderItem={
                                ({ item }) =>
                                    <SimpleListItem
                                        data={item}
                                        variant="group"
                                        onPress={() => { }}
                                        selectedId=""
                                        onAdd={() => addMembership(item.groupId)}
                                        onDelete={() => removeMembership(item.id)}
                                        onUpgrade={() => upgradeMembership(item.id, item.authorizations)}
                                        onDowngrade={() => downgradeMembership(item.id, item.authorizations)}
                                    />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <MoonStars color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Não há grupos na instituição
                                    </Text>
                                </Center>
                            )}
                        />

                    </VStack>

                </VStack>

                <Menu variant="blank" />

                <Alert
                    title="Membro promovido a moderador!"
                    acceptButtonText="Ok"
                    isOpen={confirmPromoteUser}
                    onAccept={() => setConfirmPromoteUser(false)}
                />

                <Alert
                    title="Membro não é mais um moderador!"
                    acceptButtonText="Ok"
                    isOpen={confirmDepromoteUser}
                    onAccept={() => setConfirmDepromoteUser(false)}
                />

                <Alert
                    title="Membro removido com sucesso!"
                    acceptButtonText="Voltar"
                    isOpen={confirmRemoveUser}
                    onAccept={() => navigation.goBack()}
                />

                <Alert
                    title="Deseja realmente remover o membro?"
                    description="Todos os dados da instituição referentes ao membro serão excluídos."
                    acceptButtonText="Sim"
                    acceptButtonColor="red"
                    cancelButtonText="Não"
                    isOpen={confirmRemoveUserIntention}
                    onCancel={() => setConfirmRemoveUserIntention(false)}
                    onAccept={removeMember}
                />

                <AlertPopup
                    status="error"
                    title="Tente novamente mais tarde!"
                    description={error}
                    onClose={() => setError("")}
                    isOpen={error !== ""}
                />

            </VStack>}
        </>
    );
}