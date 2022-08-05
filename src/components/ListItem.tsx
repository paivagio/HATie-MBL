import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { Buildings, UsersThree, UsersFour, PersonSimple, Hourglass, CircleWavyCheck } from 'phosphor-react-native';

export type ListItemProps = {
    id: string;
    name: string;
    members: number;
    processed?: boolean;
    owned?: boolean;
}

type Props = IPressableProps & {
    data: ListItemProps;
    variant: 'institution' | 'group' | 'patient' | 'summary';
}

export function ListItem({ data, variant, ...rest }: Props) {
    const { colors } = useTheme();
    const itemColor = variant === 'institution' ? colors.orange[700] : variant === 'group' ? colors.blue[500] : variant === 'patient' ? colors.blue[300] : colors.blue[700];
    const ItemIcon = variant === 'institution' ? Buildings : variant === 'group' ? UsersFour : variant === 'patient' ? PersonSimple : data.processed ? CircleWavyCheck : Hourglass;
    const iconColor = ItemIcon === CircleWavyCheck ? colors.green[300] : ItemIcon === Hourglass ? colors.orange[700] : itemColor;

    return (
        <Pressable {...rest}>
            <HStack
                bg="white"
                mb={4}
                alignItems="center"
                justifyContent="space-between"
                rounded="sm"
                overflow="hidden"
            >
                <Box h="full" w={2} bg={itemColor} />

                <VStack flex={1} my={5} ml={5}>
                    <Text color="gray.600" fontSize="md" fontFamily="Roboto_500Medium">
                        {data.name}
                    </Text>
                    <HStack alignItems="center">
                        <UsersThree size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.members} membros
                        </Text>
                    </HStack>
                </VStack>

                <Circle bg="gray.600" h={12} w={12} mr={5}>
                    <ItemIcon size={24} color={iconColor} />
                </Circle>
            </HStack>
        </Pressable>
    );
}