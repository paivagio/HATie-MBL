import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, Buildings, Medal, Bed, UsersThree, Calendar } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import institutionService from '../services/institutionService';
import { Loading } from '../components/Loading';
import { Institution } from '../@types';

type RouteParams = {
    institutionId: string;
};

export const toDateFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export function InstitutionDetails() {
    const [institutionData, setInstitutionData] = useState<Institution>(null);
    const [groups, setGroups] = useState<ListItemProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    useEffect(() => {
        institutionService.getInstitution(institutionId)
            .then(response => {
                setInstitutionData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (institutionData && groups.length === 0) {
            const institutionGroups = institutionData.Group.map<ListItemProps>(group => {
                return {
                    id: group.id,
                    name: group.name,
                    patient: group._count.Patient
                };
            });
            setGroups(institutionGroups);
        }
    }, [institutionData])

    function handleOpenDetails(groupId: string) {
        navigation.navigate('groupDetails', { groupId });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="Detalhes da instituição" mr={88} />

                <VStack flex={1} px={6}>

                    <VStack>
                        <HStack
                            w="full"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            bg="white"
                            py={15}
                            px={14}
                            mt={14}
                            rounded="sm"
                        >
                            <VStack>
                                <Heading fontSize="md" mb={3}>{institutionData.name}</Heading>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <Medal size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData.User.fullname}</Text>
                                </HStack>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <Bed size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData._count.Patient} pacientes</Text>
                                </HStack>
                                <HStack w="full" alignItems="center" mb={1}>
                                    <UsersThree size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{institutionData._count.Member} membros</Text>
                                </HStack>
                                <HStack w="full" alignItems="center">
                                    <Calendar size={18} color={colors.orange[700]} />
                                    <Text ml={2} fontSize="xs">{toDateFormat(institutionData.createdAt)}</Text>
                                </HStack>
                            </VStack>

                            <Circle bg="orange.700" h={63} w={63} mr={5}>
                                <Buildings size={34} color="white" />
                            </Circle>
                        </HStack>

                        <Button title="Gerenciar" w="full" my={14} />
                    </VStack>

                    <Heading color="gray.600" fontSize="lg" mb={4}>
                        Grupos
                    </Heading>

                    <FlatList
                        data={groups}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ListItem data={item} variant="group" onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <SmileyMeh color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui{'\n'}
                                    grupos em sua instituição
                                </Text>
                            </Center>
                        )}
                    />
                </VStack>

                <Menu variant="group" onPress={() => console.log('Ferro e Lucas trouxas')} />
            </VStack>}
        </>
    );
}