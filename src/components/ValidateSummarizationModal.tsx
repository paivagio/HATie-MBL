import React, { useState } from "react";
import { AlertDialog, Button, Center, VStack, Text, TextArea, HStack, ITextAreaProps, FormControl, useTheme } from "native-base";
import { WarningCircle } from "phosphor-react-native";

type AlertProps = ITextAreaProps & {
  title: string;
  isOpen: boolean;
  onCancel: Function;
  onAccept: Function;
  transcription: string;
  isInvalid: boolean;
};

export const ValidateSummarizationModal = ({ title, isOpen, onCancel, onAccept, transcription, isInvalid, ...rest }: AlertProps) => {
  const cancelRef = React.useRef(null);
  const [validatedText, setValidatedText] = useState<string>("");

  const { colors } = useTheme();

  return (
    <Center>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => { }}>
        <AlertDialog.Content>

          <VStack my={6} mx={4}>
            <Text color="gray.500" fontSize="lg" fontFamily="Roboto_500Medium">{title}</Text>


            <TextArea
              w="100%"
              h={64}
              placeholder="Escreva aqui a transcrição do áudio"
              _dark={{ placeholderTextColor: "gray.300" }}
              mt="5"
              defaultValue={transcription}
              onChangeText={value => setValidatedText(value)}
              fontSize="sm"
              autoCompleteType={undefined}
              isInvalid={isInvalid}
              {...rest}
            />

            <FormControl mb={2} isInvalid={isInvalid}>
              <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                O transcrição validada não pode ser igual à anterior.
              </FormControl.ErrorMessage>
            </FormControl>

            <HStack justifyContent="space-between" mt={6}>
              <Button
                variant="ghost"
                colorScheme="gray"
                onPress={() => onCancel()}
                ref={cancelRef}
                w="45%"
              >
                Cancelar
              </Button>

              <Button
                colorScheme="green"
                onPress={() => onAccept(validatedText)}
                w="45%"
              >
                Validar
              </Button>
            </HStack>
          </VStack>

        </AlertDialog.Content>
      </AlertDialog>
    </Center>);
};