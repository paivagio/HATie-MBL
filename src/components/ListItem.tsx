import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { Buildings, Bug, UsersThree, UsersFour, PersonSimple, Hourglass, CircleWavyCheck, Bed, IdentificationBadge, ClockClockwise, ClockAfternoon } from 'phosphor-react-native';
import { SummarizationStatus } from '../@types';

const categoryToColor = {
    Problema: '#D35400',
    Teste: '#410F92',
    Ocorrencia: '#920F3E',
    Tratamento: '#28B463',
    DepartamentoClinico: '#2E86C1',
    Evidencia: '#45E9AB'
}

type SummaryTags = {
    token: string;
    category: 'Problema' | 'Teste' | 'Ocorrencia' | 'DepartamentoClinico' | 'Tratamento';
}

export type ListItemProps = {
    id: string;
    name: string;
    members?: number;
    patient?: number;
    patientName?: string;
    lastUpdated?: string;
    createdOn?: string;
    status?: string;
    tags?: SummaryTags[];
    owned?: boolean;
    memberId?: string;
    memberPermissions?: number;
    groupMemberId?: string;
}

type Props = IPressableProps & {
    data: ListItemProps;
    variant: 'institution' | 'group' | 'patient' | 'summary';
}

export function ListItem({ data, variant, ...rest }: Props) {
    const { colors } = useTheme();
    const itemColor = variant === 'institution' ? colors.orange[700] : variant === 'group' ? colors.blue[500] : variant === 'patient' ? colors.blue[300] : colors.blue[700];
    const ItemIcon = variant === 'institution' ? Buildings : variant === 'group' ? UsersFour : variant === 'patient' ? PersonSimple : data.status === SummarizationStatus.COMPLETED ? CircleWavyCheck : data.status === SummarizationStatus.PROCESSING ? Hourglass : Bug;
    const iconColor = ItemIcon === CircleWavyCheck ? colors.green[300] : ItemIcon === Hourglass ? colors.orange[700] : ItemIcon === Bug ? colors.red[500] : itemColor;

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
                    {data.members !== undefined ? <HStack alignItems="center">
                        <UsersThree size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.members} membros
                        </Text>
                    </HStack> : null}
                    {data.patient !== undefined ? <HStack alignItems="center">
                        <Bed size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.patient} pacientes
                        </Text>
                    </HStack> : null}
                    {data.patientName ? <HStack alignItems="center">
                        <IdentificationBadge size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.patientName}
                        </Text>
                    </HStack> : null}
                    {data.lastUpdated ? <HStack alignItems="center">
                        <ClockClockwise size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.lastUpdated}
                        </Text>
                    </HStack> : null}
                    {data.createdOn ? <HStack alignItems="center">
                        <ClockAfternoon size={15} color={colors.gray[300]} />
                        <Text color="gray.400" fontSize="xs" ml={1}>
                            {data.createdOn}
                        </Text>
                    </HStack> : null}
                    {data.tags ? <HStack w="full" mt={2}>
                        {data.tags.map(tag => {
                            return (
                                <Box
                                    key={tag.token}
                                    bg={categoryToColor[tag.category]}
                                    rounded="xl"
                                    py={1}
                                    px={3}
                                    mr={1.5}>
                                    <Text color="white" fontSize={10} w={tag.token.length >= 14 ? 14 : undefined} noOfLines={1}>
                                        {tag.token}
                                    </Text>
                                </Box>
                            )
                        })}
                    </HStack> : null}
                </VStack>

                <Circle bg="gray.600" h={12} w={12} mr={5}>
                    <ItemIcon size={24} color={iconColor} />
                </Circle>
            </HStack>
        </Pressable>
    );
}