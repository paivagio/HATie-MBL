import { HStack, IconButton, IPressableProps, Pressable, useTheme } from 'native-base';
import { House, GearSix, Plus } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = IPressableProps & {
    variant: 'institution' | 'group' | 'patient' | 'summary' | 'blank';
    home?: boolean;
    preferences?: boolean;
}

export function Menu({ variant, home, preferences, ...rest }: Props) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const circleColor = variant === 'institution' ? colors.orange[700] : variant === 'group' ? colors.blue[500] : variant === 'patient' ? colors.blue[300] : variant === 'summary' ? colors.blue[700] : colors.gray[100];

    const toHome = () => {
        navigation.navigate('home');
    };

    const toPreferences = () => {
        navigation.navigate('preferences');
    };

    return (
        <HStack
            pt={3}
            pb={5}
            px={39}
            w="full"
            bg="white"
            alignItems="center"
            justifyContent="space-between"
        >
            <IconButton
                icon={<House size={32} color={home ? colors.green[700] : colors.gray[400]} />}
                onPress={() => toHome()}
            />

            <Pressable
                justifyContent="center"
                alignItems="center"
                bg={circleColor}
                h={55}
                w={55}
                rounded={50}
                _pressed={variant !== 'blank' && { bg: "orange.500" }}
                {...rest}
            >
                {
                    variant === 'blank' ? <></> : <Plus size={30} color={colors.black} />
                }
            </Pressable>

            <IconButton
                icon={<GearSix size={32} color={preferences ? colors.green[700] : colors.gray[400]} />}
                onPress={() => toPreferences()}
            />
        </HStack>
    );
}