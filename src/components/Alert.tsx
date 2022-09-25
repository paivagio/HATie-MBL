import { AlertDialog, Button, Center, VStack, Text, HStack, IButtonProps } from "native-base";
import { IAlertDialogProps } from "native-base/lib/typescript/components/composites";
import React from "react";

type AlertProps = {
  title: string;
  description?: string;
  cancelButtonText?: string;
  acceptButtonText: string;
  acceptButtonColor?: IButtonProps["colorScheme"];
  isOpen: boolean;
  onCancel?: Function;
  onAccept: Function;
};

export const Alert = ({ title, description, acceptButtonText, acceptButtonColor = "green", cancelButtonText, isOpen, onCancel, onAccept, ...rest }: AlertProps) => {
  const cancelRef = React.useRef(null);

  return (
    <Center>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => { }} {...rest}>
        <AlertDialog.Content>

          <VStack my={6} mx={4}>
            <Text color="gray.500" fontSize="lg" fontFamily="Roboto_500Medium">{title}</Text>

            {description
              ? <Text color="gray.500" fontSize="sm" mt={3} >{description}</Text>
              : <></>}

            <HStack justifyContent="space-between" mt={6}>
              {cancelButtonText
                ? <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={() => onCancel()}
                  ref={cancelRef}
                  w={24}
                >
                  {cancelButtonText}
                </Button>
                : <></>}

              <Button
                colorScheme={acceptButtonColor}
                onPress={() => onAccept()}
                w={cancelButtonText ? 24 : "full"}
              >
                {acceptButtonText}
              </Button>
            </HStack>
          </VStack>

        </AlertDialog.Content>
      </AlertDialog>
    </Center>);
};