import { Group } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postGroup: async (
        id: string,
        name: string,
        description: string
    ) => {
        try {
            const data = await Api.post<Group>(`institutions/${id}/groups`, {
                name: name,
                description: description
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getGroup: async (id: string) => {
        try {
            const data = await Api.get<Group>(`groups/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchGroup: async (
        id: string,
        name: string,
        description: string
    ) => {
        try {
            const data = await Api.patch<Group>(`groups/${id}`, {
                name: name,
                description: description
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteGroup: async (id: string) => {
        try {
            const data = await Api.delete<Group>(`groups/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};