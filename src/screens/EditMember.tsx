import { Center, FlatList, Heading, HStack, Text, useTheme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Barbell, Calendar, IdentificationBadge, MoonStars, Ruler, ShieldCheckered, Star, UserCircle } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';

import memberService from '../services/memberService';

import { toDateFormat } from './InstitutionDetails';
import { Group, GroupMember, Member } from '../@types';
import { SimpleListItem } from '../components/SimpleListItem';
import institutionService from '../services/institutionService';
import groupMemberService from '../services/groupMemberService';

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
                            if (axios.isAxiosError(error)) {
                                console.log('error message: ', error.message);
                            } else {
                                console.log('unexpected error: ', error);
                            }
                            setIsLoading(false);
                        });
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
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
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
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
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
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
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
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
            });
    };

    const removeMember = () => {
        memberService.deleteMember(memberId)
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

    const promoteMember = () => {
        memberService.patchMember(memberId, 111)
            .then((response) => {
                setMemberData({ ...memberData, ...response.data });
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                } else {
                    console.log('unexpected error: ', error);
                }
            });
    };

    const depromoteMember = () => {
        memberService.patchMember(memberId, 1)
            .then((response) => {
                setMemberData({ ...memberData, ...response.data });
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
                                    Membro desde de {toDateFormat(memberData.acceptedAt)}
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
                            onPress={() => removeMember()}
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

            </VStack>}
        </>
    );
}