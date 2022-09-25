import { Alert, HStack, VStack, Text, IAlertProps, Collapse, IconButton, CloseIcon, Box, Center } from "native-base"
import React from "react"

type Props = IAlertProps & {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: Function;
}

export const AlertPopup = ({ isOpen, onClose, status, title, description, ...rest }: Props) => {

    return (
        <Center
            opacity={isOpen ? 1 : 0}
            position="absolute"
            zIndex={1}
            top={24}
            alignSelf="center"
            w="full"
        >
            <Alert w="100%" variant="subtle" colorScheme="success" status={status} {...rest}>
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" _dark={{ color: "coolGray.800" }}>
                                {title}
                            </Text>
                        </HStack>
                        <IconButton
                            variant="unstyled"
                            _focus={{ borderWidth: 0 }}
                            icon={<CloseIcon size="3" />}
                            _icon={{ color: "coolGray.600" }}
                            onPress={() => onClose()}
                        />
                    </HStack>

                    {description
                        ? <Box pl="6" _dark={{
                            _text: {
                                color: "coolGray.600"
                            }
                        }}>
                            {description}
                        </Box>
                        : <></>}
                </VStack>
            </Alert>
        </Center>
    )
}