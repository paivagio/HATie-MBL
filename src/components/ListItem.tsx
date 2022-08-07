import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { Buildings, UsersThree, UsersFour, PersonSimple, Hourglass, CircleWavyCheck, Bed, IdentificationBadge, ClockClockwise, ClockAfternoon } from 'phosphor-react-native';

type SummaryTags = {
    name: string;
    type: 'Condition' | 'Procedure' | 'Substance';
}

export type ListItemProps = {
    id: string;
    name: string;
    members?: number;
    patient?: number;
    patientName?: string;
    lastUpdated?: string;
    createdOn?: string;
    processed?: boolean;
    tags?: SummaryTags[];
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
                    {data.members && <HStack alignItems="center">
                        <UsersThree size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.members} membros
                        </Text>
                    </HStack>}
                    {data.patient && <HStack alignItems="center">
                        <Bed size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.patient} pacientes
                        </Text>
                    </HStack>}
                    {data.patientName && <HStack alignItems="center">
                        <IdentificationBadge size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.patientName}
                        </Text>
                    </HStack>}
                    {data.lastUpdated && <HStack alignItems="center">
                        <ClockClockwise size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.lastUpdated}
                        </Text>
                    </HStack>}
                    {data.createdOn && <HStack alignItems="center">
                        <ClockAfternoon size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.createdOn}
                        </Text>
                    </HStack>}
                    {data.tags && <HStack w="full" mt={2}>
                        {data.tags.map(tag => {
                            return (
                                <Text
                                    key={tag.name}
                                    bg={tag.type === 'Condition' ? '#1A0F92' : tag.type === 'Procedure' ? '#410F92' : '#920F3E'}
                                    color="white"
                                    fontSize={10}
                                    py={1}
                                    px={3}
                                    mr={3}
                                    rounded="xl"
                                >
                                    {tag.name}
                                </Text>
                            )
                        })}
                    </HStack>}
                </VStack>

                <Circle bg="gray.600" h={12} w={12} mr={5}>
                    <ItemIcon size={24} color={iconColor} />
                </Circle>
            </HStack>
        </Pressable>
    );
}