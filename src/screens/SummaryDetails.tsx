import { useRoute } from '@react-navigation/native';
import { Heading, HStack, VStack, Text, useTheme, Box, ScrollView } from 'native-base';
import { CircleWavyCheck, Hourglass } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Summarization } from '../@types';
import { FindingsTable } from '../components/FindingsTable';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import summarizationService from '../services/summarizationService';

type RouteParams = {
    summaryId: string;
};

export function SummaryDetails() {
    const [data, setData] = useState<Summarization>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { colors } = useTheme();
    const route = useRoute();

    const { summaryId } = route.params as RouteParams;
    const tableContents = data ? [
        { title: "Doenças", values: data.insights.structuredData.conditions },
        { title: "Medicamentos", values: data.insights.structuredData.substances.medicines },
        { title: "Substâncias", values: data.insights.structuredData.substances.other },
        { title: "Exames de imagem", values: data.insights.structuredData.procedures.imagingExams },
        { title: "Exames laboratoriais", values: data.insights.structuredData.procedures.laboratoryTests }
    ] : [];

    useEffect(() => {
        summarizationService.getSummarization(summaryId)
            .then(response => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    const toDateFormatLong = (dateString: string) => {
        const date = new Date(dateString);
        const stringDate = date.toLocaleDateString('pt-BR');
        const stringHour = date.getHours();
        return `${stringDate} às ${stringHour}h`;
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="Detalhes da sumarização" mr={75} />

                <HStack
                    w="114%"
                    alignItems="center"
                    justifyContent="center"
                    py={3}
                    bg="gray.700"
                    position="relative"
                    left={-24}>
                    {data.transcription !== ""
                        ? <>
                            <CircleWavyCheck size={22} color={colors.green[700]} />
                            <Text fontSize="sm" fontWeight="bold" color={colors.green[700]} ml={2}>FINALIZADO</Text>
                        </>
                        : <>
                            <Hourglass size={22} color={colors.orange[700]} />
                            <Text fontSize="sm" fontWeight="bold" color={colors.orange[700]} ml={2} >EM PROCESSAMENTO</Text>
                        </>
                    }
                </HStack>

                <ScrollView>
                    <VStack flex={1} px={6}>
                        <HStack
                            w="full"
                            alignItems="center"
                            justifyContent="space-between"
                            my={17}>
                            <Heading fontSize="lg">{data.title}</Heading>
                            <Text>{toDateFormatLong(data.createdAt)}</Text>
                        </HStack>

                        <HStack w="full" mt={2}>
                            {data.insights.tags.map(tag => {
                                return (
                                    <Text
                                        key={tag.name}
                                        bg={tag.type === 'Condition' ? '#1A0F92' : tag.type === 'Procedure' ? '#410F92' : '#920F3E'}
                                        color="white"
                                        fontSize={10}
                                        py={1}
                                        px={5}
                                        mr={3}
                                        rounded="xl"
                                    >
                                        {tag.name}
                                    </Text>
                                )
                            })}
                        </HStack>

                        <VStack
                            w="full"
                            bg="white"
                            rounded="sm"
                            py={4}
                            px={5}
                            my={4}
                        >
                            <Heading fontSize="md" mb={2}>Transcrição</Heading>
                            <Text fontSize="xs">{data.transcription}</Text>
                        </VStack>

                        <VStack
                            w="full"
                            bg="white"
                            rounded="sm"
                            py={5}
                            px={5}
                            my={4}
                        >
                            <Heading fontSize="md" mb={3}>Descobertas</Heading>
                            <FindingsTable data={tableContents} />
                        </VStack>
                    </VStack>
                </ScrollView>

                <Menu variant="blank" />
            </VStack>}
        </>
    );
}