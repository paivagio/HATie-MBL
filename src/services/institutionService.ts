import { Institution } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postInstitution: async (
        ownerId: string,
        name: string
    ) => {
        try {
            const data = await Api.post<Institution>(`institutions`, {
                ownerId: ownerId,
                name: name
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getInstitution: async (id: string) => {
        try {
            const data = await Api.get<Institution>(`institutions/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchInstitution: async (
        id: string,
        name: string
    ) => {
        try {
            const data = await Api.patch<Institution>(`institutions/${id}`, {
                name: name
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteInstitution: async (id: string) => {
        try {
            const data = await Api.delete<Institution>(`institutions/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};