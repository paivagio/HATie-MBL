import { Box, HStack, Text, useTheme, VStack, Pressable, IPressableProps, IconButton } from 'native-base';
import { ArrowDown, ArrowUp, Plus, X } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Member, User } from '../@types';

type SimpleListItemProps = {
    id: string;
    name?: string;
    fullname?: string;
    User?: User;
    Member?: Member;
    authorizations?: number;
}

type Props = IPressableProps & {
    data: SimpleListItemProps;
    variant: 'institution' | 'group' | 'patient' | 'summary' | 'member' | 'memberPending';
    selectedId: string;
    onAdd?: Function;
    onUpgrade?: Function;
    onDowngrade?: Function;
    onDelete?: Function;
}

export function SimpleListItem({ data, variant, selectedId, onAdd, onUpgrade, onDowngrade, onDelete, ...rest }: Props) {
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

                        <HStack flex={1} my={3} ml={4} alignItems="center">
                            <Text color={textColor} fontSize="sm" w={variant === "group" ? 20 : "full"} noOfLines={1}>
                                {data.name ?? data.fullname ?? data.User?.fullname ?? data.Member?.User.fullname ?? ""}
                            </Text>
                            {variant !== 'group'
                                ? <></>
                                : data.id
                                    ? <HStack right={3} position="absolute" alignItems="center">
                                        <Text color={data.authorizations >= 1 ? colors.gray[600] : colors.gray[200]} fontSize="sm" mr={1}>
                                            R
                                        </Text>

                                        <Text color={data.authorizations >= 11 ? colors.gray[600] : colors.gray[200]} fontSize="sm" mr={1}>
                                            W
                                        </Text>

                                        <Text color={data.authorizations >= 111 ? colors.gray[600] : colors.gray[200]} fontSize="sm">
                                            D
                                        </Text>

                                        <IconButton
                                            icon={<ArrowUp size={20} color={colors.green[700]} />}
                                            onPress={() => onUpgrade()}
                                            isDisabled={data.authorizations >= 111}
                                        />

                                        <IconButton
                                            icon={<ArrowDown size={20} color={colors.orange[300]} />}
                                            onPress={() => onDowngrade()}
                                            isDisabled={data.authorizations <= 1}
                                        />

                                        <IconButton
                                            icon={<X size={20} color={colors.red[500]} />}
                                            onPress={() => onDelete()}
                                        />
                                    </HStack>
                                    : <HStack right={3} position="absolute" alignItems="center">
                                        <Text color={colors.gray[200]} fontSize="sm" mr={1}>
                                            R
                                        </Text>

                                        <Text color={colors.gray[200]} fontSize="sm" mr={1}>
                                            W
                                        </Text>

                                        <Text color={colors.gray[200]} fontSize="sm">
                                            D
                                        </Text>

                                        <IconButton
                                            icon={<Plus size={20} color={colors.green[700]} />}
                                            onPress={() => onAdd()}
                                        />
                                    </HStack>

                            }

                        </HStack>

                    </HStack>
                )
            }
            }
        </Pressable>
    );
}