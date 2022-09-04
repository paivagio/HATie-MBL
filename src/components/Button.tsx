import { Button as ButtonNativeBase, IButtonProps, Heading, useTheme } from 'native-base';

type Props = IButtonProps & {
    title: string;
    variant?: 'white' | 'red' | 'green' | 'orange' | 'cyan' | 'darkblue' | 'gray';
}

export function Button({ title, variant = 'white', ...rest }: Props) {
    const { colors } = useTheme();
    let buttonColor = colors.white;
    let textColor = colors.gray[700];
    let onClickColor = colors.gray[100];

    if (variant === 'red') {
        buttonColor = colors.red[500];
        textColor = colors.white;
        onClickColor = colors.red[100];
    } else if (variant === 'green') {
        buttonColor = colors.green[700];
        textColor = colors.white;
        onClickColor = colors.green[500];
    } else if (variant === 'gray') {
        buttonColor = colors.gray[300];
        textColor = colors.white;
    } else if (variant === 'cyan') {
        buttonColor = colors.blue[300];
        textColor = colors.white;
    } else if (variant === 'orange') {
        buttonColor = colors.orange[700];
        textColor = colors.white;
        onClickColor = colors.orange[500];
    } else if (variant === 'darkblue') {
        buttonColor = colors.blue[700];
        textColor = colors.white;
        onClickColor = colors.blue[500];
    }

    return (
        <ButtonNativeBase
            bg={buttonColor}
            h={14}
            fontSize="sm"
            rounded="sm"
            _pressed={{ bg: onClickColor }}
            {...rest}
        >
            <Heading color={textColor} fontSize="sm">
                {title}
            </Heading>
        </ButtonNativeBase>
    );
}