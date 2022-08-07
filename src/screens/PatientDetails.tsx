import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonNativeBase, HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, CaretLeft, Buildings, Medal, Bed, UsersThree, Calendar, PersonSimple, IdentificationBadge, Ruler, Barbell } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

export function PatientDetails() {
    const [summaries, setSummaries] = useState<ListItemProps[]>([
        {
            id: '456',
            name: 'Sumarização #001',
            createdOn: '20/01/2022 às 14h',
            processed: true,
            tags: [
                { name: 'Diabetes', type: 'Condition' },
                { name: 'Raio-X', type: 'Procedure' },
                { name: 'Amoxilina', type: 'Substance' }
            ]
        },
        {
            id: '457',
            name: 'Sumarização #002',
            createdOn: '20/01/2022 às 17h',
            processed: false
        }
    ]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleOpenDetails(orderId: string) {
        navigation.navigate('summaryDetails');
    }

    return (
        <VStack flex={1} bg="background">
            <Header title="Detalhes do paciente" mr={98} />

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
                            <Heading fontSize="md" mb={3}>Paciente #002</Heading>
                            <HStack>
                                <VStack mr={7}>
                                    <HStack w="full" alignItems="center" mb={1}>
                                        <IdentificationBadge size={18} color={colors.blue[300]} />
                                        <Text ml={2} fontSize="xs">Renato da Silva</Text>
                                    </HStack>
                                    <HStack w="full" alignItems="center" mb={1}>
                                        <Calendar size={18} color={colors.blue[300]} />
                                        <Text ml={2} fontSize="xs">22/05/1965</Text>
                                    </HStack>
                                </VStack>
                                <VStack>
                                    <HStack w="full" alignItems="center" mb={1}>
                                        <Ruler size={18} color={colors.blue[300]} />
                                        <Text ml={2} fontSize="xs">1,78 m</Text>
                                    </HStack>
                                    <HStack w="full" alignItems="center">
                                        <Barbell size={18} color={colors.blue[300]} />
                                        <Text ml={2} fontSize="xs">75 kg</Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </VStack>

                        <Circle bg="blue.300" h={63} w={63} mr={5}>
                            <PersonSimple size={34} color="white" />
                        </Circle>
                    </HStack>

                    <Button title="Remover do grupo" w="full" my={14} />
                </VStack>

                <Heading color="gray.600" fontSize="lg" mb={4}>
                    Sumarizações
                </Heading>

                <FlatList
                    data={summaries}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ListItem data={item} variant="summary" onPress={() => handleOpenDetails(item.id)} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <Center>
                            <SmileyMeh color={colors.gray[300]} size={40} />
                            <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                Não existem entradas{'\n'}
                                de áudio associadas ao paciente
                            </Text>
                        </Center>
                    )}
                />
            </VStack>

            <Menu variant="summary" onPress={() => navigation.navigate('newRecording')} />
        </VStack>
    );
}