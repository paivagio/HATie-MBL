import { FormControl, Heading, Icon, useTheme, VStack } from 'native-base';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Barbell, Calendar, IdentificationBadge, Ruler, WarningCircle } from 'phosphor-react-native';
import axios from 'axios';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Menu } from '../components/Menu';
import { Input } from '../components/Input';

import patientService from '../services/patientService';
import memberService from '../services/memberService';
import { User } from '../@types';
import userService from '../services/userService';

type RouteParams = {
    institutionId: string;
};

export function NewMember() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [userDoesNotExists, setUserDoesNotExists] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [user, setUser] = useState<User>();

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();

    const { institutionId } = route.params as RouteParams;

    const addMember = async () => {
        if (!user) return;

        console.log(user)

        setIsRequired(false);
        setIsLoading(true);

        memberService.postMember(institutionId, user.id)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.request);
                } else {
                    console.log('unexpected error: ', error);
                }
            });
    };

    const checkUserExists = async () => {
        if (!email) {
            setIsRequired(true);
            return;
        };

        setIsRequired(false);

        userService.getUserByEmail(email)
            .then((response) => {
                setUserDoesNotExists(false);
                setUser(response.data);
                addMember();
            })
            .catch((error) => {
                setUserDoesNotExists(true);
            });
    };

    return (
        <>
            {isLoading ? <Loading /> : <VStack flex={1} bg="background">
                <Header title="" mr={200} />

                <VStack flex={1} px={6}>
                    <Heading color="gray.600" fontSize="lg" mt={8} mb={4}>
                        Adicionar membro
                    </Heading>

                    <VStack mx={6}>

                        <FormControl mb={8} isInvalid={(isRequired && !email) || userDoesNotExists}>
                            <Input
                                placeholder="Email"
                                InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
                                onChangeText={setEmail}
                                bg="white"
                                mb={3}
                                isInvalid={(isRequired && !email) || userDoesNotExists}
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningCircle size={20} color={colors.red[500]} />}>
                                {email ? "Usuário não encontrado" : "Favor preencher o campo"}
                            </FormControl.ErrorMessage>
                        </FormControl>

                    </VStack>

                    <Button
                        title="Enviar convite"
                        variant="green"
                        w="153"
                        ml="160"
                        mt={5}
                        onPress={() => checkUserExists()}
                    />

                </VStack>

                <Menu variant="blank" />

            </VStack>}
        </>
    );
}