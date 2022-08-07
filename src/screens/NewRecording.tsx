import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, HStack, IconButton, useTheme, Text, ITextProps, Heading, Circle } from 'native-base';
import { Microphone } from 'phosphor-react-native';
import { Audio, AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess } from 'expo-av';

import { Menu } from '../components/Menu';
import { Button } from '../components/Button';

export function NewRecording() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording>();
    const [sound, setSound] = useState<Audio.Sound>();
    const [recordingUri, setRecordingUri] = useState<string>();
    const navigation = useNavigation();
    const { colors } = useTheme();

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setIsRecording(true);
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording..');
        setIsRecording(false);
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordingUri(uri);
        console.log('Recording stopped and stored at', uri);
    };

    const playSound = async () => {
        let loaded = false;
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            { uri: recordingUri },
            null,
            (playerStatus: AVPlaybackStatus) => {
                if (playerStatus.isLoaded) loaded = true;

            },
            true
        );
        if (loaded) {
            console.log('Playing Sound');
            await sound.playAsync()
                .then((res: AVPlaybackStatusSuccess) => {
                    console.log(res.positionMillis)
                }).catch((err: AVPlaybackStatusError) => {
                    console.log(err.error)
                });
        }
        setSound(sound);
        setIsPlaying(true);
    };

    const stopSound = async () => {
        console.log('Stopping Sound');
        sound.unloadAsync();
        setIsPlaying(false);
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
                <Circle bg="gray.300" h={120} w={120} mt={170} mb={150}>
                    <Microphone size={72} color={isRecording ? colors.green[300] : colors.white} />
                </Circle>

                <HStack w="full" justifyContent="space-between">
                    <Button title="Cancelar" variant="red" w="153" onPress={() => navigation.goBack()} />
                    {isRecording
                        ? <Button title="Parar" variant="gray" w="153" onPress={() => stopRecording()} />
                        : (recordingUri
                            ? <Button title="Reiniciar" variant="gray" w="153" onPress={() => setRecordingUri(undefined)} />
                            : <Button title="Gravar" variant="green" w="153" onPress={() => startRecording()} />
                        )
                    }
                </HStack>
                {recordingUri && <Button title={isPlaying ? "Stop" : "Play"} variant="green" w="full" mt={4} onPress={isPlaying ? stopSound : playSound} />}

            </VStack>

            <Menu variant="blank" />
        </VStack>
    );
}