import { Patient } from '../@types';
import Api from '../providers/ApiProvider';

export default {
    postPatient: async (
        id: string,
        fullname: string,
        birthDate?: string,
        height?: number,
        weight?: number,
        groupId?: string
    ) => {
        try {
            const data = await Api.post<Patient>(`institutions/${id}/patients`, {
                fullname: fullname,
                birthDate: birthDate,
                height: height,
                weight: weight,
                groupId: groupId
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getPatient: async (id: string) => {
        try {
            const data = await Api.get<Patient>(`patients/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchPatient: async (
        id: string,
        fullname?: string,
        birthDate?: string,
        height?: number,
        weight?: number,
        groupId?: string,
        institutionId?: string
    ) => {
        try {
            const data = await Api.patch<Patient>(`patients/${id}`, {
                fullname: fullname,
                birthDate: birthDate,
                height: height,
                weight: weight,
                groupId: groupId,
                institutionId: institutionId
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deletePatient: async (id: string) => {
        try {
            const data = await Api.delete<Patient>(`patients/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};