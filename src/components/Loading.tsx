import { Center, Spinner } from 'native-base';

export function Loading({ ...rest }) {
    return (
        <Center flex={1} bg="white" {...rest}>
            <Spinner color="green.700" />
        </Center>
    );
}