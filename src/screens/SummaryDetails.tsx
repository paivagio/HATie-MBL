import { Heading, HStack, VStack, Text, useTheme, Box } from 'native-base';
import { CircleWavyCheck, Hourglass } from 'phosphor-react-native';
import React, { useState } from 'react';
import { FindingsTable } from '../components/FindingsTable';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';

interface SummaryDetails {
    title: string
    transcription: string;
    audioPath?: string;
    insights: {
        tags: Array<{ tag: string; category: string }>;
        highlightedTranscription: Array<{ words: string; category: string }>;
        structuredData: {
            conditions: Array<string>;
            substances: {
                medicines: Array<string>;
                other: Array<string>;
            };
            procedures: {
                imagingExams: Array<string>;
                laboratoryTests: Array<string>;
            };
        }
    },
    createdAt: string
};

export function SummaryDetails() {
    const [data, setData] = useState<SummaryDetails>(
        {
            title: 'Sumarização #001',
            transcription: 'Texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto texto.',
            audioPath: null,
            insights: {
                tags: [
                    { tag: "Diabetes", category: "Condition" },
                    { tag: "Raio-X", category: "Procedure" },
                    { tag: "Amoxilina", category: "Substance" }
                ],
                highlightedTranscription: [],
                structuredData: {
                    conditions: ["diabetes", "hipertensao"],
                    substances: {
                        medicines: ["amoxilina"],
                        other: ["soro fisiologico"]
                    },
                    procedures: {
                        imagingExams: ["raio-x"],
                        laboratoryTests: ["hemograma"]
                    }
                }
            },
            createdAt: "20/01/2022 às 14h"
        },
    );
    const { colors } = useTheme();

    const tableContents = [
        { title: "Doenças", values: data.insights.structuredData.conditions },
        { title: "Medicamentos", values: data.insights.structuredData.substances.medicines },
        { title: "Substâncias", values: data.insights.structuredData.substances.other },
        { title: "Exames de imagem", values: data.insights.structuredData.procedures.imagingExams },
        { title: "Exames laboratoriais", values: data.insights.structuredData.procedures.laboratoryTests }
    ];

    return (
        <VStack flex={1} bg="background">
            <Header title="Detalhes da sumarização" mr={75} />

            <VStack flex={1} px={6}>
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

                <HStack
                    w="full"
                    alignItems="center"
                    justifyContent="space-between"
                    my={17}>
                    <Heading fontSize="lg">{data.title}</Heading>
                    <Text>{data.createdAt}</Text>
                </HStack>

                <HStack w="full" mt={2}>
                    {data.insights.tags.map(tag => {
                        return (
                            <Text
                                key={tag.tag}
                                bg={tag.category === 'Condition' ? '#1A0F92' : tag.category === 'Procedure' ? '#410F92' : '#920F3E'}
                                color="white"
                                fontSize={10}
                                py={1}
                                px={5}
                                mr={3}
                                rounded="xl"
                            >
                                {tag.tag}
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

            <Menu variant="blank" />
        </VStack>
    );
}