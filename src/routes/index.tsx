import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { User } from '../@types';
import { Loading } from '../components/Loading';
import { SignIn } from '../screens/SignIn';
import store from '../store/store';

import { AppRoutes } from './app.routes';

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
                    {user ? <AppRoutes /> : <SignIn />}
                </NavigationContainer>
            }
        </>
    )
}