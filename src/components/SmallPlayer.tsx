import React, { useState } from 'react';
import { HStack, Progress, VStack, Text, useTheme, IconButton } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Pause, Play } from 'phosphor-react-native';

type Props = IVStackProps & {
    recordingURI: string;
    show?: boolean;
    setError: Function;
}

export function SmallPlayer({ recordingURI, show = true, setError, ...rest }: Props) {
    const [sound, setSound] = useState<Audio.Sound>();
    const [recordedTime, setRecordedTime] = useState<number>(0);
    const [playingTime, setPlayingTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { colors } = useTheme();

    const _onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
        if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
        } else {
            // Update your UI for the loaded state
            if (!recordedTime) setRecordedTime(playbackStatus.playableDurationMillis)

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

    const play = async () => {
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
                sound.playFromPositionAsync(0);
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const pause = async () => {
        try {
            await sound.pauseAsync();
            setIsPlaying(false);
        } catch (error) {
            setError(error.message);
            setIsPlaying(false);
        }
    };

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

    return (
        <HStack
            bg={show ? colors.green[700] : colors.red[700]}
            borderRadius="50"
            h={show ? 12 : 9}
            p={2}
            alignItems="center"
            {...rest}
        >
            {
                show
                    ? <>
                        <IconButton
                            icon={isPlaying
                                ? <Pause weight="fill" size={16} color={colors.black} />
                                : <Play weight="fill" size={16} color={colors.black} />
                            }
                            onPress={() => { isPlaying ? pause() : play() }}
                            bg={colors.white}
                            borderRadius="50"
                            mr={3}
                        />

                        <HStack w="50%" alignItems="center" mt={1}>
                            <Text
                                fontSize="xs"
                                w={10}
                                h={6}
                                mr={2}
                                textAlign="center"
                                alignItems="center"
                                color={colors.white}
                            >
                                {new Date(playingTime).toISOString().substring(14, 19)}
                            </Text>

                            <Progress
                                size="xs"
                                w="full"
                                colorScheme="emerald"
                                bg={colors.white}
                                _filledTrack={{ bg: colors.black }}
                                mb={2}
                                value={playingTime}
                                min={0}
                                max={recordedTime}
                            />

                            <Text
                                fontSize="xs"
                                w={10}
                                h={6}
                                ml={2}
                                textAlign="center"
                                alignItems="center"
                                color={colors.white}
                            >
                                {new Date(recordedTime).toISOString().substring(14, 19)}
                            </Text>

                        </HStack>
                    </>
                    : <>
                        <Text
                            fontSize="xs"
                            w="full"
                            color={colors.white}
                            ml={16}
                            textTransform="uppercase"
                        >
                            Arquivo de áudio indisponível
                        </Text>
                    </>
            }

        </HStack>
    );
}