import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonNativeBase, HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, CaretLeft, Bed, UsersThree, Calendar, UsersFour } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

export function GroupDetails() {
    const [groups, setGroups] = useState<ListItemProps[]>([
        {
            id: '456',
            name: 'Paciente #001',
            patientName: 'Maria Cecilia do Rosario',
            lastUpdated: '2h'
        },
        {
            id: '457',
            name: 'Paciente #002',
            patientName: 'Renato da Silva',
            lastUpdated: '12min'
        },
        {
            id: '458',
            name: 'Paciente #003',
            patientName: 'Lucas Ferro Antunes de Oliveira',
            lastUpdated: '5d'
        }
    ]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleOpenDetails(orderId: string) {
        navigation.navigate('patientDetails');
    }

    return (
        <VStack flex={1} bg="background">
            <Header title="Detalhes do grupo" mr={110} />

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
                        <VStack
                            flex={1}
                            justifyContent="flex-start"
                        >
                            <Heading fontSize="md" mb={1}>Clínica Geral</Heading>
                            <Text fontSize="xs" mb={3} >Este grupo é direcionado para pacientes atendidos dentro da área de clínica geral.</Text>
                            <HStack w="full" alignItems="center" mb={1}>
                                <Bed size={18} color={colors.blue[500]} />
                                <Text ml={2} fontSize="xs">55 pacientes</Text>
                            </HStack>
                            <HStack w="full" alignItems="center" mb={1}>
                                <UsersThree size={18} color={colors.blue[500]} />
                                <Text ml={2} fontSize="xs">3 responsáveis</Text>
                            </HStack>
                            <HStack w="full" alignItems="center">
                                <Calendar size={18} color={colors.blue[500]} />
                                <Text ml={2} fontSize="xs">07/05/2022</Text>
                            </HStack>
                        </VStack>

                        <Circle bg="blue.500" h={63} w={63} mr={5}>
                            <UsersFour size={34} color="white" />
                        </Circle>
                    </HStack>

                    <Button title="Gerenciar" w="full" my={14} />
                </VStack>

                <Heading color="gray.600" fontSize="lg" mb={4}>
                    Pacientes
                </Heading>

                <FlatList
                    data={groups}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ListItem data={item} variant="patient" onPress={() => handleOpenDetails(item.id)} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <Center>
                            <SmileyMeh color={colors.gray[300]} size={40} />
                            <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                Não existem pacientes{'\n'}
                                associados ao grupo
                            </Text>
                        </Center>
                    )}
                />
            </VStack>

            <Menu variant="patient" onPress={() => console.log('Ferro e Lucas trouxas')} />
        </VStack>
    );
}