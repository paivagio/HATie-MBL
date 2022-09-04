import { Member, Status } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postMember: async (
        id: string,
        userId: string
    ) => {
        try {
            const data = await Api.post<Member>(`institutions/${id}/members`, {
                userId: userId
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getMember: async (id: string) => {
        try {
            const data = await Api.get<Member>(`members/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    getMembers: async (id: string) => {
        try {
            const data = await Api.get<Member[]>(`institutions/${id}/members`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchMember: async (
        id: string,
        authorizations?: number,
        invitationStatus?: Status
    ) => {
        try {
            const data = await Api.patch<Member>(`members/${id}`, {
                authorizations: authorizations,
                invitation: invitationStatus
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteMember: async (id: string) => {
        try {
            const data = await Api.delete<Member>(`members/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};