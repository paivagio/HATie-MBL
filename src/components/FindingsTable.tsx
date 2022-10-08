import { Box, HStack, VStack, Text } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React from 'react';

type Row = {
    title: string;
    values: Array<string>;
    color: string;
}

type Props = IVStackProps & {
    data: Row[];
}

export function FindingsTable({ data, ...rest }: Props) {
    return (
        <VStack {...rest}>
            {data.map((row) => {
                return (
                    row.values.length > 0
                        ? <HStack
                            key={row.title}
                            w="full"
                            mb={0.2}
                            alignItems="center"
                            borderBottomWidth={3}
                            borderColor="white">
                            <Box
                                bg={row.color}
                                w="35%"
                                h="full"
                                px={2}
                                py={1}
                                _text={{
                                    fontSize: "xs",
                                    color: "white",
                                }}>
                                {row.title}
                            </Box>
                            <Text
                                bg="white"
                                px={3}
                                py={1}
                                w="65%"
                                fontSize="xs"
                                color="gray.600"
                                overflow="hidden"
                            >
                                {row.values.join('\n')}
                            </Text>
                        </HStack>
                        : null
                );
            })}
        </VStack>
    );
}