import { extendTheme } from 'native-base';

export const THEME = extendTheme({
    colors: {
        primary: {
            700: '#996DFF'
        },
        orange: {
            700: '#F25D07',
            500: '#F28D00'
        },
        yellow: {
            300: '#F7CB73'
        },
        red: {
            500: '#F75A68',
            100: '#FF9EA7'
        },
        green: {
            700: '#18A558',
            500: '#00B37E',
            300: '#04D361',
            100: '#A3EBB1'
        },
        blue: {
            700: '#05445E',
            500: '#189AB4',
            300: '#75E6DA',
            100: '#D4F1F4'
        },
        gray: {
            700: '#121214',
            600: '#202024',
            500: '#29292E',
            400: '#323238',
            300: '#7C7C8A',
            200: '#C4C4CC',
            100: '#E1E1E6'
        },
        white: '#FFFFFF',
        black: '#000000',
        background: '#EFEEF3'
    },
    fonts: {
        heading: 'Roboto_700Bold',
        body: 'Roboto_400Regular',
    },
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
    },
    sizes: {
        14: 56
    }
});