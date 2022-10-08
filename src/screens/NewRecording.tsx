import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, HStack, useTheme, Text, Circle } from 'native-base';
import { Audio, AVPlaybackStatus } from 'expo-av';

import { Microphone } from 'phosphor-react-native';

import { Menu } from '../components/Menu';
import { Button } from '../components/Button';
import { Player } from '../components/Player';
import { Loading } from '../components/Loading';
import { Alert } from '../components/Alert';
import { AlertPopup } from '../components/AlertPopup';

import summarizationService from '../services/summarizationService';

type RouteParams = {
    patientId: string;
    patientTitle: string;
    groupId: string;
    groupMemberId: string;
};

export function NewRecording() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [audioPermission, setAudioPermission] = useState<boolean>();
    const [recordingURI, setRecordingURI] = useState<string>();
    const [recording, setRecording] = useState<Audio.Recording>();
    const [sound, setSound] = useState<Audio.Sound>();
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const [recordedTime, setRecordedTime] = useState<number>(0);
    const [playingTime, setPlayingTime] = useState<number>(0);

    const [error, setError] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [confirmRestartIntention, setConfirmRestartIntention] = useState<boolean>(false);
    const [confirmCancelIntention, setConfirmCancelIntention] = useState<boolean>(false);
    const [confirmSent, setConfirmSent] = useState<boolean>(false);

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { patientId, patientTitle, groupId, groupMemberId } = route.params as RouteParams;

    useEffect(() => {
        getAudioPermission();
    }, []);

    const getAudioPermission = async () => {
        const permission = await Audio.getPermissionsAsync();
        setAudioPermission(permission.granted);
    };

    const requestAudioPermission = async () => {
        const request = await Audio.requestPermissionsAsync();
        setAudioPermission(request.granted);
    };

    const goBack = async () => {
        if (recording) await recording.stopAndUnloadAsync();
        if (sound) await sound.unloadAsync();
        navigation.navigate('patientDetails', { patientId, patientTitle, groupId, groupMemberId });
    };

    const restart = async () => {
        if (sound) await unmountRecordedAudio();
        setConfirmRestartIntention(false);
        setRecordingURI(undefined);
        setRecordingTime(0);
        setRecordedTime(0);
        setPlayingTime(0);
    }

    const _onRecordingStatusUpdate = (recordingStatus: Audio.RecordingStatus) => {
        if (recordingStatus.durationMillis >= 180000) stopRecording();
        setRecordingTime(recordingStatus.durationMillis);
    };

    const _onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
        if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
        } else {
            // Update your UI for the loaded state

            if (playbackStatus.isPlaying) {
                // Update your UI for the playing state
                setIsPlaying(true);
            } else {
                // Update your UI for the paused state
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                unmountRecordedAudio();
                setIsPlaying(false);
            }
            setPlayingTime(playbackStatus.positionMillis);
        }
    };

    const startRecording = async () => {
        try {
            if (!audioPermission) requestAudioPermission();
            else {
                await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
                    _onRecordingStatusUpdate);
                setRecording(recording);
                setIsRecording(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const stopRecording = async () => {
        try {
            setRecordedTime(recordingTime);
            await recording.stopAndUnloadAsync();
            console.log(recording.getURI() ?? "");
            setRecordingURI(recording.getURI() ?? "");
            setIsRecording(false);
            setRecording(undefined);
        } catch (error) {
            setError(error.message);
        }
    };

    const playRecordedAudio = async () => {
        try {
            if (!sound) {
                await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
                const { sound: soundObj } = await Audio.Sound.createAsync(
                    { uri: recordingURI },
                    { shouldPlay: true },
                    _onPlaybackStatusUpdate,
                    true
                );
                setSound(soundObj);
            } else {
                sound.playFromPositionAsync(playingTime);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const pauseRecordedAudio = async () => {
        try {
            await sound.pauseAsync();
        } catch (error) {
            setError(error.message);
        }
    };

    const restartRecordedAudio = async () => {
        try {
            if (sound) await unmountRecordedAudio();
            const { sound: soundObj } = await Audio.Sound.createAsync(
                { uri: recordingURI },
                { shouldPlay: true },
                _onPlaybackStatusUpdate,
                true
            );
            setSound(soundObj);
        } catch (error) {
            setError(error.message);
        }
    }

    const unmountRecordedAudio = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
                setIsPlaying(false);
                setSound(undefined);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const submit = async () => {
        setIsSending(true);
        summarizationService.postSummarization(patientId, recordingURI)
            .then(() => {
                setIsSending(false);
                setConfirmSent(true);
            })
            .catch(error => {
                setError(error.message);
                setIsSending(false);
            });
    };

    return (
        <VStack flex={1} bg="background">
            <HStack
                w="full"
                justifyContent="center"
                alignItems="center"
                bg="white"
                pt={12}
                pb={1}
                px={4}
            >
                <Text color="gray.500" fontSize="md" mb={3}>Nova entrada de áudio</Text>
            </HStack>

            <VStack
                flex={1}
                px={6}
                alignItems="center"
            >
                <Circle bg="gray.300" h={120} w={120} mt={110} mb={70}>
                    <Microphone size={72} color={isRecording ? colors.green[300] : colors.white} />
                </Circle>

                <Player
                    value={recordingTime}
                    min={0}
                    max={180000}
                    showButtons={false}
                    show={isRecording}
                    mb={30}
                />

                <Player
                    value={playingTime}
                    min={0}
                    max={recordedTime}
                    showButtons={true}
                    onPause={pauseRecordedAudio}
                    onPlay={playRecordedAudio}
                    onRepeat={restartRecordedAudio}
                    show={recordingURI !== undefined}
                    mb={30}
                />

                <HStack w="full" justifyContent="space-between">
                    <Button title="Cancelar" variant="red" w="153" onPress={() => setConfirmCancelIntention(true)} />
                    {isRecording
                        ? <Button title="Parar" variant="gray" w="153" onPress={() => stopRecording()} />
                        : (recordingURI
                            ? <Button title="Reiniciar" variant="gray" w="153" onPress={() => setConfirmRestartIntention(true)} />
                            : <Button title="Gravar" variant="green" w="153" onPress={() => startRecording()} />
                        )
                    }
                </HStack>
                {recordingURI && <Button title="Enviar" variant="green" w="full" mt={4} onPress={() => submit()} isLoading={isSending} />}
            </VStack>

            <Menu variant="blank" />

            <Alert
                title="Deseja realmente cancelar a gravação?"
                description="O áudio gravado será perdido."
                acceptButtonText="Sim"
                acceptButtonColor="red"
                cancelButtonText="Não"
                isOpen={confirmCancelIntention}
                onCancel={() => setConfirmCancelIntention(false)}
                onAccept={goBack}
            />

            <Alert
                title="Deseja realmente reiniciar a gravação?"
                description="O áudio gravado será perdido."
                acceptButtonText="Sim"
                acceptButtonColor="red"
                cancelButtonText="Não"
                isOpen={confirmRestartIntention}
                onCancel={() => setConfirmRestartIntention(false)}
                onAccept={restart}
            />

            <Alert
                title="Áudio enviado com sucesso!"
                acceptButtonText="Voltar"
                isOpen={confirmSent}
                onAccept={() => goBack()}
            />

            <AlertPopup
                status="error"
                title="Tente novamente mais tarde!"
                description={error}
                onClose={() => setError("")}
                isOpen={error !== ""}
            />

        </VStack>

    );
}