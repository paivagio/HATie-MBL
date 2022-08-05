import { Text, Button, IButtonProps } from 'native-base';

type Props = IButtonProps & {
    title: string;
    isActive?: boolean;
}

export function Filter({ title, isActive = false, ...rest }: Props) {
    return (
        <Button
            variant="outline"
            borderWidth={isActive ? 1 : 0}
            borderColor="green.700"
            bgColor="white"
            flex={1}
            size="sm"
            {...rest}
        >
            <Text color={isActive ? "green.700" : "gray.300"} fontSize="xs" textTransform="uppercase">
                {title}
            </Text>
        </Button>
    );
}