import { HStack, Progress, VStack, Text, useTheme, IconButton } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { PauseCircle, Play, Repeat } from 'phosphor-react-native';
import React from 'react';

type Props = IVStackProps & {
    value: number;
    min?: number;
    max: number;
    showButtons?: boolean;
    onPause?: Function;
    onPlay?: Function;
    onRepeat?: Function;
    show?: boolean;
}

export function Player({ value, min = 0, max, showButtons = false, onPause, onPlay, onRepeat, show = true, ...rest }: Props) {
    const { colors } = useTheme();

    return (
        <VStack w="90%" maxW="400" {...rest}>
            {show &&
                <>
                    <Progress
                        size="xs"
                        colorScheme="emerald"
                        bg={colors.gray[200]}
                        _filledTrack={{ bg: colors.black }}
                        mb={2}
                        value={value}
                        min={min}
                        max={max}
                    />
                    <HStack w="full" alignItems="center" justifyContent="space-between">
                        <Text fontSize="xs">{new Date(value).toISOString().substring(14, 19)}</Text>
                        <Text fontSize="xs">{new Date(max).toISOString().substring(14, 19)}</Text>
                    </HStack>

                    {showButtons && <HStack w="full" alignItems="center" justifyContent="center">
                        <IconButton
                            icon={<PauseCircle size={36} color={colors.gray[600]} />}
                            onPress={() => onPause()}
                        />
                        <IconButton
                            icon={<Play size={36} color={colors.gray[600]} />}
                            onPress={() => onPlay()}
                            mx={23}
                        />
                        <IconButton
                            icon={<Repeat size={36} color={colors.gray[600]} />}
                            onPress={() => onRepeat()}
                        />
                    </HStack>}
                </>}
        </VStack>
    );
}