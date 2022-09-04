import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle } from 'native-base';
import { SmileyMeh, Calendar, PersonSimple, IdentificationBadge, Ruler, Barbell } from 'phosphor-react-native';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Patient, Summarization, SummarizationStatus } from '../@types';
import patientService from '../services/patientService';
import { toDateFormat } from './InstitutionDetails';
import { Loading } from '../components/Loading';

type RouteParams = {
    patientId: string;
    patientTitle: string;
};

export function PatientDetails() {
    const [patientData, setPatientData] = useState<Patient>(null);
    const [summaries, setSummaries] = useState<ListItemProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { patientId, patientTitle } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            patientService.getPatient(patientId)
                .then(response => {
                    setPatientData(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setIsLoading(false);
                });
        }, [])
    );

    useEffect(() => {
        if (patientData && summaries.length === 0) {
            const orderedSummaries = patientData.Summarization.sort((summA: Summarization, summB: Summarization) => {
                return new Date(summA.createdAt).getTime() - new Date(summB.createdAt).getTime();
            })

            const patientSummaries = orderedSummaries.map<ListItemProps>((summary, key) => {
                return {
                    id: summary.id,
                    name: `Sumarização #0${key + 1}`,
                    createdOn: toDateFormatLong(summary.createdAt),
                    processed: summary.status === SummarizationStatus.COMPLETED,
                    tags: summary.insights.tags
                };
            });

            setSummaries(patientSummaries);
        }
    }, [patientData]);

    const handleOpenDetails = (summaryId: string) => {
        navigation.navigate('summaryDetails', { summaryId });
    };

    const removePatientFromGroup = () => {
        patientService.patchPatient(patientId, null, null, null, null, "", null)
            .then(() => {
                navigation.goBack();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const toDateFormatLong = (dateString: string) => {
        const date = new Date(dateString);
        const stringDate = date.toLocaleDateString('pt-BR');
        const stringHour = date.getHours();
        return `${stringDate} às ${stringHour}h`;
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
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
                                <Heading fontSize="md" mb={3}>{patientTitle}</Heading>
                                <HStack>
                                    <VStack mr={7}>
                                        <HStack w="full" alignItems="center" mb={1}>
                                            <IdentificationBadge size={18} color={colors.blue[300]} />
                                            <Text ml={2} fontSize="xs">{patientData.fullname}</Text>
                                        </HStack>
                                        <HStack w="full" alignItems="center" mb={1}>
                                            <Calendar size={18} color={colors.blue[300]} />
                                            <Text ml={2} fontSize="xs">{toDateFormat(patientData.birthDate ?? "none")}</Text>
                                        </HStack>
                                    </VStack>
                                    <VStack>
                                        <HStack w="full" alignItems="center" mb={1}>
                                            <Ruler size={18} color={colors.blue[300]} />
                                            <Text ml={2} fontSize="xs">{patientData.height ? `${patientData.height} m` : "none"}</Text>
                                        </HStack>
                                        <HStack w="full" alignItems="center">
                                            <Barbell size={18} color={colors.blue[300]} />
                                            <Text ml={2} fontSize="xs">{patientData.weight ? `${patientData.weight} kg` : "none"}</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </VStack>

                            <Circle bg="blue.300" h={63} w={63} mr={5}>
                                <PersonSimple size={34} color="white" />
                            </Circle>
                        </HStack>

                        <Button title="Remover do grupo" w="full" my={14} onPress={() => removePatientFromGroup()} />
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

                <Menu variant="summary" onPress={() => navigation.navigate('newRecording', { patientId, patientTitle })} />
            </VStack>}
        </>
    );
}