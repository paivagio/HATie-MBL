import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, HStack, useTheme, Text, Circle } from 'native-base';
import { Microphone } from 'phosphor-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';

import { Menu } from '../components/Menu';
import { Button } from '../components/Button';
import { Player } from '../components/Player';

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

    const navigation = useNavigation();
    const { colors } = useTheme();

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
        navigation.goBack();
    };

    const restart = async () => {
        if (sound) await unmountRecordedAudio();
        setRecordingURI(undefined);
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
            console.log(error);
        }
    };

    const stopRecording = async () => {
        try {
            setRecordedTime(recordingTime);
            await recording.stopAndUnloadAsync();
            setRecordingURI(recording.getURI() ?? "");
            setIsRecording(false);
            setRecording(undefined);
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    };

    const pauseRecordedAudio = async () => {
        try {
            await sound.pauseAsync();
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        }
    };

    const submit = async () => {
        console.log(recordingURI);
        goBack();
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
                    <Button title="Cancelar" variant="red" w="153" onPress={() => goBack()} />
                    {isRecording
                        ? <Button title="Parar" variant="gray" w="153" onPress={() => stopRecording()} />
                        : (recordingURI
                            ? <Button title="Reiniciar" variant="gray" w="153" onPress={() => restart()} />
                            : <Button title="Gravar" variant="green" w="153" onPress={() => startRecording()} />
                        )
                    }
                </HStack>
                {recordingURI && <Button title="Enviar" variant="green" w="full" mt={4} onPress={() => submit()} />}
            </VStack>

            <Menu variant="blank" />
        </VStack>
    );
}