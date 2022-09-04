import { GroupMember, Status } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postGroupMember: async (
        id: string,
        memberId: string,
        authorizations: number
    ) => {
        try {
            const data = await Api.post<GroupMember>(`groups/${id}/groupmembers`, {
                memberId: memberId,
                authorizations: authorizations
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getGroupMember: async (id: string) => {
        try {
            const data = await Api.get<GroupMember>(`groupmembers/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    getGroupMembers: async (id: string) => {
        try {
            const data = await Api.get<GroupMember[]>(`groups/${id}/groupmembers`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchGroupMember: async (
        id: string,
        authorizations?: number
    ) => {
        try {
            const data = await Api.patch<GroupMember>(`groupmembers/${id}`, {
                authorizations: authorizations
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteGroupMember: async (id: string) => {
        try {
            const data = await Api.delete<GroupMember>(`groupmembers/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};