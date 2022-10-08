import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, useTheme, Text, ITextProps } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';

type Props = ITextProps & {
    title: string;
    customGoBack?: Function;
}

export function Header({ title, customGoBack, ...rest }: Props) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <HStack
            w="full"
            justifyContent="space-around"
            alignItems="center"
            bg="white"
            pt={12}
            pb={1}
            px={4}
        >

            <IconButton
                icon={<CaretLeft size={26} color={colors.gray[300]} />}
                onPress={() => { customGoBack ? customGoBack() : navigation.goBack() }}
            />

            <Text
                color="gray.500"
                fontSize="md"
                {...rest}
            >
                {title}
            </Text>
        </HStack>
    );
}