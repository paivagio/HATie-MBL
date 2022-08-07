import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { SmileyMeh, EnvelopeSimple, EnvelopeSimpleOpen } from 'phosphor-react-native';

import Logo from '../assets/logo_text_dark.svg';

import { Filter } from '../components/Filter';
import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';

export function Home() {
    const [selectedFilter, setSelectedFilter] = useState<'first' | 'second'>('first');
    const [pendingInvites, setPendingInvites] = useState(false);
    const [institutions, setInstitutions] = useState<ListItemProps[]>([
        {
            id: '456',
            name: 'Hospital Marcelino Champagnat',
            members: 110,
            owned: false
        },
        {
            id: '123',
            name: 'Hospital Universitário Cajuru',
            members: 88,
            owned: false
        },
        {
            id: '321',
            name: 'Clínica - Fraturas Norte',
            members: 20,
            owned: true
        }
    ]);
    const filteredInstitutions = institutions.filter(item => item.owned === (selectedFilter === 'first'));

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleNewOrder() {
        // navigation.navigate('new');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('institutionDetails');
    }

    return (
        <VStack flex={1} bg="background">
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
                                {selectedFilter === 'first' ? 'possui' : 'participa de'} uma instituição
                            </Text>
                        </Center>
                    )}
                />
            </VStack>

            <Menu variant="institution" onPress={() => console.log('Ferro e Lucas trouxas')} home />
        </VStack>
    );
}