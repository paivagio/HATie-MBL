import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonNativeBase, HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, CaretLeft, Buildings, Medal, Bed, UsersThree, Calendar } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

export function InstitutionDetails() {
    const [groups, setGroups] = useState<ListItemProps[]>([
        {
            id: '456',
            name: 'Clinica Geral',
            patient: 55
        },
        {
            id: '457',
            name: 'UTI',
            patient: 3
        },
        {
            id: '458',
            name: 'Ortopedia',
            patient: 37
        },
        {
            id: '459',
            name: 'Pediatria',
            patient: 68
        }
    ]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleOpenDetails(orderId: string) {
        navigation.navigate('groupDetails');
    }

    return (
        <VStack flex={1} bg="background">
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
                            <Heading fontSize="md" mb={3}>Clínica - Fraturas Norte</Heading>
                            <HStack w="full" alignItems="center" mb={1}>
                                <Medal size={18} color={colors.orange[700]} />
                                <Text ml={2} fontSize="xs">Dr. Renilda das Gracas</Text>
                            </HStack>
                            <HStack w="full" alignItems="center" mb={1}>
                                <Bed size={18} color={colors.orange[700]} />
                                <Text ml={2} fontSize="xs">135 pacientes</Text>
                            </HStack>
                            <HStack w="full" alignItems="center" mb={1}>
                                <UsersThree size={18} color={colors.orange[700]} />
                                <Text ml={2} fontSize="xs">20 membros</Text>
                            </HStack>
                            <HStack w="full" alignItems="center">
                                <Calendar size={18} color={colors.orange[700]} />
                                <Text ml={2} fontSize="xs">15/03/2022</Text>
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
        </VStack>
    );
}