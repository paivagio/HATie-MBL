import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HStack, VStack, useTheme, Text, Heading, FlatList, Center, Circle, IconButton } from 'native-base';

import { SmileyMeh, Calendar, PersonSimple, IdentificationBadge, Ruler, Barbell } from 'phosphor-react-native';
import { AntDesign } from '@expo/vector-icons';

import { ListItem, ListItemProps } from '../components/ListItem';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import patientService from '../services/patientService';

import { Patient, Summarization } from '../@types';

import { StoreState } from '../store/store';
import { useSelector } from '../hooks';

import { toBrazilianFormat } from './NewPatient';
import { leaveNumbersOnly } from './EditPatient';

type RouteParams = {
    patientId: string;
    patientTitle: string;
    groupId: string;
    groupMemberId: string;
};

export const toDateFormatLong = (dateString: string) => {
    const stringDate = toBrazilianFormat(leaveNumbersOnly(dateString))
    const stringHour = new Date(dateString).getHours();
    return `${stringDate} às ${stringHour}h`;
};

export function PatientDetails() {
    const { isOwner, isModerator } = useSelector((state: StoreState) => state.access);
    const { canWrite, canDelete } = useSelector((state: StoreState) => state.access.groupPermissions);

    const [patientData, setPatientData] = useState<Patient>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [confirmRemoveIntention, setConfirmRemoveIntention] = useState<boolean>(false);
    const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { patientId, patientTitle, groupId, groupMemberId } = route.params as RouteParams;

    useFocusEffect(
        React.useCallback(() => {
            patientService.getPatient(patientId)
                .then(response => {
                    setPatientData(response.data);
                    setIsLoading(false);
                    setIsRefreshing(false);
                })
                .catch(error => {
                    setError(error.message);
                    setIsLoading(false);
                    setIsRefreshing(false);
                });
        }, [reload])
    );

    const assembleSummaries = (patientData: Patient,) => {
        if (patientData) {
            const orderedSummaries = patientData.Summarization.sort((summA: Summarization, summB: Summarization) => {
                return new Date(summA.createdAt).getTime() - new Date(summB.createdAt).getTime();
            })

            const patientSummaries = orderedSummaries.map<ListItemProps>((summary, key) => {
                return {
                    id: summary.id,
                    name: `Entrada #0${key + 1}`,
                    createdOn: toDateFormatLong(summary.createdAt),
                    status: summary.status,
                    tags: summary.insights.tags
                };
            });

            return patientSummaries;
        }
    };

    const handleOpenDetails = (summaryId: string, summaryTitle: string) => {
        navigation.navigate('summaryDetails', { summaryId, summaryTitle });
    };

    const removePatientFromGroup = () => {
        setConfirmRemoveIntention(false);
        setIsRemoving(true);
        patientService.patchPatient(patientId, null, null, null, null, "", null)
            .then(() => {
                setIsRemoving(false);
                setConfirmRemove(true);
            })
            .catch(error => {
                setError(error.message);
                setIsRemoving(false);
            });
    };

    const summaries: ListItemProps[] = assembleSummaries(patientData);

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
                                            <Text ml={2} fontSize="xs">{toBrazilianFormat(leaveNumbersOnly(patientData.birthDate))}</Text>
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

                        <HStack w="full" my={14} justifyContent="space-between">

                            <Button
                                title="Remover do grupo"
                                w="78%"
                                onPress={() => setConfirmRemoveIntention(true)}
                                isDisabled={!isOwner && !isModerator && !canDelete}
                                isLoading={isRemoving}
                            />

                            <IconButton
                                w="20%"
                                bg="white"
                                icon={<AntDesign name="reload1" size={24} color="black" />}
                                onPress={() => { setReload(!reload); setIsRefreshing(true) }}
                            />

                        </HStack>

                    </VStack>

                    <Heading color="gray.600" fontSize="lg" mb={4}>
                        Entradas de áudio
                    </Heading>

                    {isRefreshing
                        ? <Loading bg="transparent" />
                        : <FlatList
                            data={summaries ?? []}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <ListItem data={item} variant="summary" onPress={() => handleOpenDetails(item.id, item.name)} />}
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
                        />}
                </VStack>

                <Menu
                    variant={(isOwner || isModerator || canWrite) ? "summary" : "blank"}
                    onPress={() => { (isOwner || isModerator || canWrite) ? navigation.navigate('newRecording', { patientId, patientTitle, groupId, groupMemberId }) : {} }}
                />

                <Alert
                    title="Deseja realmente remover o paciente?"
                    description="Você pode adicionar o paciente novamente em outro momento."
                    acceptButtonText="Sim"
                    acceptButtonColor="red"
                    cancelButtonText="Não"
                    isOpen={confirmRemoveIntention}
                    onCancel={() => setConfirmRemoveIntention(false)}
                    onAccept={removePatientFromGroup}
                />

                <Alert
                    title="Paciente removido com sucesso!"
                    acceptButtonText="Voltar"
                    isOpen={confirmRemove}
                    onAccept={() => navigation.navigate('groupDetails', { groupId, groupMemberId })}
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