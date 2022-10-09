import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import { User } from '../@types';
import { Loading } from '../components/Loading';

import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';

import { AppRoutes } from './app.routes';

import store from '../store/store';
import { ResetPassword } from '../screens/ResetPassword';

const { Navigator, Screen } = createNativeStackNavigator();

export function Routes() {
    const [loading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        store.subscribe(listener);
        listener();
    }, []);

    const listener = () => {
        const current = store.getState();
        setUser(current.auth.user);
        setIsLoading(false);
    }

    return (
        <>
            {loading
                ? <Loading />
                : <NavigationContainer>
                    {user
                        ? <AppRoutes />
                        : <Navigator screenOptions={{ headerShown: false }}>
                            <Screen name="signin" component={SignIn} />
                            <Screen name="signup" component={SignUp} />
                            <Screen name="resetPassword" component={ResetPassword} />
                        </Navigator>}
                </NavigationContainer>
            }
        </>
    )
}