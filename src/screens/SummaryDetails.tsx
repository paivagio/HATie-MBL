import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Heading, HStack, VStack, Text, useTheme, Box, ScrollView, IconButton, Center } from 'native-base';
import * as FileSystem from 'expo-file-system';

import { Bug, CircleWavyCheck, Hourglass, Smiley, SmileySad, Tag } from 'phosphor-react-native';

import { AlertPopup } from '../components/AlertPopup';
import { Button } from '../components/Button';
import { FindingsTable } from '../components/FindingsTable';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { SmallPlayer } from '../components/SmallPlayer';
import { Alert } from '../components/Alert';
import { ValidateSummarizationModal } from '../components/ValidateSummarizationModal';

import summarizationService from '../services/summarizationService';

import { Summarization, SummarizationStatus } from '../@types';

import { toDateFormatLong } from './PatientDetails';

type RouteParams = {
    summaryId: string;
    summaryTitle: string;
};

export const categoryToColor = {
    Problema: '#D35400',
    Teste: '#410F92',
    Ocorrencia: '#920F3E',
    Tratamento: '#28B463',
    DepartamentoClinico: '#2E86C1',
    Evidencia: '#45E9AB'
}

export function SummaryDetails() {
    const [data, setData] = useState<Summarization>(null);
    const [downloadedAudioPath, setDownloadedAudioPath] = useState<string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showTags, setShowTags] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [confirmDeleteIntention, setConfirmDeleteIntention] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [confirmValidateIntention, setConfirmValidateIntention] = useState<boolean>(false);
    const [confirmSentToValidation, setConfirmSentToValidation] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [openValidateModal, setOpenValidateModal] = useState<boolean>(false);
    const [noChangesWereMade, setNoChangesWereMade] = useState<boolean>(false);

    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();

    const tagIconColor = showTags ? "white" : colors.gray[300];

    const { summaryId, summaryTitle } = route.params as RouteParams;
    const tableContents = data?.insights && data?.insights?.tags ? [
        { title: "Departamentos clínicos", values: data.insights.structuredData.clinicaldepartments, color: '#2E86C1' },
        { title: "Ocorrências", values: data.insights.structuredData.occurances, color: '#920F3E' },
        { title: "Problemas", values: data.insights.structuredData.problems, color: '#D35400' },
        { title: "Testes", values: data.insights.structuredData.tests, color: '#410F92' },
        { title: "Tratamentos", values: data.insights.structuredData.treatments, color: '#28B463' }
    ] : [];

    useEffect(() => {
        summarizationService.getSummarization(summaryId)
            .then(response => {
                setData(response.data);
                if (!response.data.audioPath) {
                    setIsLoading(false);
                    return;
                }

                const downloadURI = "https://storage.googleapis.com" + response.data.audioPath.slice(4);
                FileSystem.downloadAsync(downloadURI, FileSystem.cacheDirectory + 'Audio/audioFile.m4a')
                    .then(({ uri }) => {
                        setDownloadedAudioPath(uri);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        setError(error.message);
                        setIsLoading(false);
                    })
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const goBack = async () => {
        if (downloadedAudioPath) await FileSystem.deleteAsync(downloadedAudioPath);
        navigation.goBack();
    };

    const deleteEntry = () => {
        setIsDeleting(true);
        setConfirmDeleteIntention(false);
        summarizationService.deleteSummarization(summaryId)
            .then(() => {
                setIsDeleting(false);
                setConfirmDelete(true);
            })
            .catch(error => {
                setError(error.message);
                setIsDeleting(false);
            })
    };

    const validateEntry = (validatedTranscription: string) => {
        if (!validatedTranscription || validatedTranscription === data.transcription) {
            setNoChangesWereMade(true);
            return;
        };

        setNoChangesWereMade(false);
        setIsValidating(true);
        summarizationService.validateSummarization(summaryId, validatedTranscription)
            .then(() => {
                setIsValidating(false);
                setOpenValidateModal(false);
                setConfirmSentToValidation(true);
            })
            .catch(error => {
                setError(error.message);
                setIsValidating(false);
                setOpenValidateModal(false);
            })
    };

    return (
        <>
            {isLoading
                ? <Loading />
                : <VStack flex={1} bg="background">
                    <Header title="Detalhes da sumarização" mr={75} customGoBack={goBack} />

                    <HStack
                        w="114%"
                        alignItems="center"
                        justifyContent="center"
                        py={3}
                        bg="gray.700"
                        position="relative"
                        left={-24}>
                        {data.status === "COMPLETED"
                            ? <>
                                <CircleWavyCheck size={22} color={colors.green[700]} />
                                <Text fontSize="sm" fontWeight="bold" color={colors.green[700]} ml={2}>FINALIZADO</Text>
                            </>
                            : data.status === "PROCESSING"
                                ? <>
                                    <Hourglass size={22} color={colors.orange[700]} />
                                    <Text fontSize="sm" fontWeight="bold" color={colors.orange[700]} ml={2} >EM PROCESSAMENTO</Text>
                                </>
                                : <>
                                    <Bug size={22} color={colors.red[500]} />
                                    <Text fontSize="sm" fontWeight="bold" color={colors.red[500]} ml={2} >FALHOU</Text>
                                </>
                        }
                    </HStack>

                    <ScrollView>
                        {data.status === SummarizationStatus.FAILED
                            ? <VStack mt="50%" alignItems="center">
                                <Center>
                                    <SmileySad color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Algo deu errado!
                                    </Text>
                                    <Text color="gray.300" fontSize="xs" mt={2} textAlign="center">
                                        {data.insights?.status && data.insights.status === 500 ? "Internal Server Error" : "Error " + data.insights.status}
                                    </Text>
                                </Center>
                                <Button
                                    title="Excluir"
                                    w="60%" mt={20}
                                    onPress={() => setConfirmDeleteIntention(true)}
                                    variant="red"
                                    isLoading={isDeleting}
                                />
                            </VStack>
                            : data.status === SummarizationStatus.PROCESSING
                                ? <VStack mt="50%" alignItems="center">
                                    <Center>
                                        <Smiley color={colors.gray[300]} size={40} />
                                        <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                            Tudo certo!{'\n'}Estamos processando seu áudio.
                                        </Text>
                                    </Center>
                                </VStack>
                                : <VStack flex={1} px={6}>
                                    <HStack
                                        w="full"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        my={17}>
                                        <Heading fontSize="lg">{summaryTitle}</Heading>
                                        <Text>{toDateFormatLong(data.createdAt)}</Text>
                                    </HStack>

                                    <HStack w="100%" mt={2}>
                                        {data.insights.tags.map(tag => {
                                            return (
                                                <Text
                                                    key={tag.token}
                                                    bg={categoryToColor[tag.category]}
                                                    color="white"
                                                    fontSize={10}
                                                    py={1}
                                                    px={5}
                                                    mr={3}
                                                    rounded="xl"
                                                >
                                                    {tag.token.toUpperCase()}
                                                </Text>
                                            )
                                        })}
                                    </HStack>

                                    <SmallPlayer
                                        recordingURI={downloadedAudioPath}
                                        setError={setError}
                                        show={downloadedAudioPath !== null}
                                        mt={4}
                                    />

                                    <VStack
                                        w="full"
                                        bg="white"
                                        rounded="sm"
                                        py={4}
                                        px={5}
                                        my={4}
                                    >
                                        <HStack w="full" alignItems="center" justifyContent="space-between" mb={3}>
                                            <VStack>
                                                <Heading fontSize="md" mb={2}>Transcrição</Heading>

                                                {showTags
                                                    ? <>
                                                        <HStack w="full">
                                                            <HStack alignItems="center" mr={3}>
                                                                <Box h={3} w={3} bg='#D35400' mr={2} />
                                                                <Text fontSize="xs" >Problema</Text>
                                                            </HStack>

                                                            <HStack alignItems="center" mr={3}>
                                                                <Box h={3} w={3} bg='#410F92' mr={2} />
                                                                <Text fontSize="xs" >Teste</Text>
                                                            </HStack>

                                                            <HStack alignItems="center">
                                                                <Box h={3} w={3} bg='#920F3E' mr={2} />
                                                                <Text fontSize="xs" >Ocorrência</Text>
                                                            </HStack>
                                                        </HStack>

                                                        <HStack w="full">
                                                            <HStack alignItems="center" mr={3}>
                                                                <Box h={3} w={3} bg='#28B463' mr={2} />
                                                                <Text fontSize="xs" >Tratamento</Text>
                                                            </HStack>

                                                            <HStack alignItems="center" mr={3}>
                                                                <Box h={3} w={3} bg='#2E86C1' mr={2} />
                                                                <Text fontSize="xs" >Departamento clínico</Text>
                                                            </HStack>
                                                        </HStack>
                                                    </>
                                                    : <></>
                                                }

                                            </VStack>

                                            <IconButton
                                                bg={showTags ? colors.green[300] : colors.gray[200]}
                                                rounded="full"
                                                icon={<Tag size={22} color={tagIconColor} />}
                                                onPress={() => setShowTags(!showTags)}
                                            />
                                        </HStack>

                                        <Text w="full" fontSize="xs" textAlign="justify">
                                            {!showTags
                                                ? data.transcription.replace(/\n/g, "")
                                                : data.insights.highlightedTranscription.map((pair, key) => {
                                                    return pair.category
                                                        ? <Text key={"tags" + key} px={3} fontSize="xs" color={categoryToColor[pair.category] ?? colors.gray[300]} fontFamily="Roboto_500Medium">{pair.token + " "}</Text>
                                                        : pair.token + " "
                                                })
                                            }
                                        </Text>

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

                                    <Button
                                        title="Excluir"
                                        w="full"
                                        mt={7}
                                        onPress={() => setConfirmDeleteIntention(true)}
                                        variant="red"
                                        isLoading={isDeleting}
                                    />

                                    <Button
                                        title="Validar entrada"
                                        w="full"
                                        mt={3}
                                        mb={10}
                                        onPress={() => setConfirmValidateIntention(true)}
                                        variant="green"
                                        isLoading={isValidating}
                                    />

                                </VStack>}
                    </ScrollView>

                    <Menu variant="blank" />

                    <ValidateSummarizationModal
                        title={'Validar entrada'}
                        isOpen={openValidateModal}
                        onCancel={() => setOpenValidateModal(false)}
                        onAccept={validateEntry}
                        transcription={data.transcription}
                        isInvalid={noChangesWereMade}
                    />

                    <Alert
                        title="Deseja validar a entrada agora?"
                        description="Você pode revalidar ela sempre que quiser."
                        acceptButtonText="Sim"
                        acceptButtonColor="green"
                        cancelButtonText="Não"
                        isOpen={confirmValidateIntention}
                        onCancel={() => setConfirmValidateIntention(false)}
                        onAccept={() => { setConfirmValidateIntention(false); setOpenValidateModal(true) }}
                    />

                    <Alert
                        title="Deseja realmente remover a entrada de áudio?"
                        description="Todos os dados vinculados serão perdidos."
                        acceptButtonText="Sim"
                        acceptButtonColor="red"
                        cancelButtonText="Não"
                        isOpen={confirmDeleteIntention}
                        onCancel={() => setConfirmDeleteIntention(false)}
                        onAccept={deleteEntry}
                    />

                    <Alert
                        title="Entrada de áudio removida com sucesso!"
                        acceptButtonText="Voltar"
                        isOpen={confirmDelete}
                        onAccept={() => navigation.goBack()}
                    />

                    <Alert
                        title="Entrada de áudio enviada para validação!"
                        acceptButtonText="Voltar"
                        isOpen={confirmSentToValidation}
                        onAccept={() => navigation.goBack()}
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