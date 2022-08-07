import { Box, HStack, VStack } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React from 'react';

type Row = {
    title: string;
    values: Array<string>;
}

type Props = IVStackProps & {
    data: Row[];
}

export function FindingsTable({ data, ...rest }: Props) {
    return (
        <VStack {...rest}>
            {data.map((row) => {
                return (
                    <HStack
                        key={row.title}
                        w="full"
                        mb={0.2}
                        alignItems="center"
                        borderBottomWidth={1}
                        borderBottomColor="black">
                        <Box
                            bg="gray.100"
                            w="35%"
                            px={2}
                            py={1}
                            _text={{
                                fontSize: "xs",
                                color: "gray.600",
                            }}>
                            {row.title}
                        </Box>
                        <Box
                            bg="white"
                            px={3}
                            py={1}
                            _text={{
                                fontSize: "xs",
                                color: "gray.600",
                            }}>
                            {
                                row.values.join(', ')
                            }
                        </Box>
                    </HStack>
                )
            })}
        </VStack>
    );
}