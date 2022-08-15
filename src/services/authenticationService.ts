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
    },
    //   get: async (
    //     systemCode
    //   ) => {
    //     try {
    // const data = await Api.post(
    //     `route/${systemCode}`
    //     );
    //       const data = await Api.get(`route`, {
    //         params: {
    //           systemCode
    //         },
    //       });
    //       return data;
    //     } catch (error) {
    //       throw error;
    //     }
    //   },
};