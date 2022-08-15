import { User, UserPreferences } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postUser: async (
        fullname: string,
        email: string,
        password: string,
        isAdmin: boolean,
        preferences: UserPreferences
    ) => {
        try {
            const data = await Api.post<User>(`users`, {
                fullname: fullname,
                email: email,
                password: password,
                isAdmin: isAdmin,
                preferences: preferences
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getUser: async (id: string) => {
        try {
            const data = await Api.get<User>(`users/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchUser: async (
        id: string,
        fullname?: string,
        email?: string,
        password?: string,
        preferences?: UserPreferences
    ) => {
        try {
            const data = await Api.patch<User>(`users/${id}`, {
                fullname: fullname,
                email: email,
                password: password,
                preferences: preferences
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (id: string) => {
        try {
            const data = await Api.delete<User>(`users/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};