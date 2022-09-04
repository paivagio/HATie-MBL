import { Box, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { User } from 'phosphor-react-native';
import { useState } from 'react';

type SimpleListItemProps = {
    id: string;
    name?: string;
    fullname?: string;
    User?: {
        fullname: string;
    }
}

type Props = IPressableProps & {
    data: SimpleListItemProps;
    variant: 'institution' | 'group' | 'patient' | 'summary' | 'member' | 'memberPending';
    selectedId: string;
}

export function SimpleListItem({ data, variant, selectedId, ...rest }: Props) {
    const selected = selectedId === data.id;

    const { colors } = useTheme();

    const itemColor = variant === 'institution' ? colors.orange[700] : variant === 'group' ? colors.blue[500] : variant === 'patient' ? colors.blue[300] : variant === 'member' ? colors.green[700] : variant === 'memberPending' ? colors.yellow[300] : colors.blue[700];
    const bgColor = selected ? colors.gray[700] : 'white';
    const textColor = selected ? 'white' : colors.gray[700];

    return (
        <Pressable
            {...rest}
        >
            {({ isPressed }) => {
                return (
                    <HStack
                        bg={isPressed ? colors.gray[100] : bgColor}
                        mb={2}
                        alignItems="center"
                        justifyContent="space-between"
                        rounded="sm"
                        overflow="hidden"
                        style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                    >
                        <Box h="full" w={2} bg={itemColor} />

                        <VStack flex={1} my={3} ml={4}>
                            <Text color={textColor} fontSize="sm">
                                {data.name ?? data.fullname ?? data.User.fullname ?? ""}
                            </Text>
                        </VStack>

                    </HStack>
                )
            }
            }
        </Pressable>
    );
}