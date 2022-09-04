import { Text, HStack, useTheme, IconButton } from 'native-base';
import { Buildings, Check, X } from 'phosphor-react-native';
import React from 'react';
import { Member } from '../@types';

type Props = {
    data: Member;
    onAccept: Function;
    onDecline: Function;
}

export function Invite({ data, onAccept, onDecline }: Props) {

    const { colors } = useTheme();

    return (
        <HStack
            key={data.id}
            bg="white"
            mb={4}
            py={2}
            px={5}
            alignItems="center"
            justifyContent="space-between"
            rounded="sm"
            overflow="hidden"
        >
            <HStack alignItems="center" justifyContent="space-between" >
                <Buildings size={24} color={colors.orange[700]} />

                <Text color="gray.400" fontSize="md" ml={3} fontFamily="Roboto_500Medium">
                    {data.Institution.name}
                </Text>
            </HStack>

            <HStack alignItems="center" justifyContent="space-between" >
                <IconButton
                    icon={<X size={22} color={colors.red[500]} />}
                    ml="auto"
                    onPress={() => onDecline(data.id)}
                />

                <IconButton
                    icon={<Check size={22} color={colors.green[700]} />}
                    onPress={() => onAccept(data.id)}
                />
            </HStack>

        </HStack>
    );
}