import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../@types';

type AuthenticationState = {
    authenticated: boolean;
    token: string;
    user?: User;
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        authenticated: false,
        token: "",
        user: null
    } as AuthenticationState,
    reducers: {
        authenticate: (state, action: PayloadAction<{ token: string, user: User }>) => {
            return { authenticated: true, token: action.payload.token, user: action.payload.user }
        },
        unauthenticate: () => {
            return { authenticated: false, token: "", user: null }
        },
        setToken: (state, action: PayloadAction<string>) => {
            return { ...state, token: action.payload }
        }
    }
});

export const {
    authenticate,
    unauthenticate,
    setToken
} = authenticationSlice.actions

export default authenticationSlice.reducer