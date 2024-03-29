import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input({ ...rest }: IInputProps) {

    return (
        <NativeBaseInput
            bg="gray.100"
            h={14}
            size="md"
            borderWidth={0}
            fontSize="md"
            fontFamily="body"
            color="black"
            placeholderTextColor="gray.300"
            _focus={{
                borderWidth: 1,
                borderColor: "green.500",
            }}
            _invalid={{
                borderWidth: 2,
                borderColor: "red.500",
            }}
            {...rest}
        />
    );
}