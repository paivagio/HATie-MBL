import { User } from '../@types';
import Api from '../providers/ApiProvider';

type AuthenticationResponse = {
    token: string;
    user: User;
}

export default {
    postAuthentication: async (
        email: string,
        password: string
    ) => {
        try {
            const data = await Api.post<AuthenticationResponse>(`auth`, {
                email: email,
                password: password
            });
            return data;
        } catch (error) {
            throw error;
        }
    }
};