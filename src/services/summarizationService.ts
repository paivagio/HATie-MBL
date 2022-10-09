import { Summarization } from '../@types';
import Api from '../providers/ApiProvider';
import * as FileSystem from 'expo-file-system'
import store from '../store/store';

const getAuthorizationToken = () => {
    const current = store.getState();
    return current.auth.token;
}

export default {
    postSummarization: async (
        id: string,
        uri: string
    ) => {
        try {
            const data = await FileSystem.uploadAsync(
                `http://192.168.1.11:4000/patients/${id}/summarizations`,
                uri,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthorizationToken()}`
                    },
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'file',
                    mimeType: 'audio/m4a',
                });
            return data.body;
        } catch (error) {
            throw error;
        };
    },
    getSummarization: async (id: string) => {
        try {
            const data = await Api.get<Summarization>(`summarizations/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
    patchSummarization: async (
        id: string,
        transcription: string,
        audioPath: string
    ) => {
        try {
            const data = await Api.patch<Summarization>(`summarizations/${id}`, {
                transcription: transcription,
                audioPath: audioPath
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    validateSummarization: async (
        id: string,
        transcription: string,
    ) => {
        try {
            const data = await Api.patch<Summarization>(`summarizations/${id}/validate`, {
                transcription: transcription
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteSummarization: async (id: string) => {
        try {
            const data = await Api.delete<Summarization>(`summarizations/${id}`, {});
            return data;
        } catch (error) {
            throw error;
        }
    },
};