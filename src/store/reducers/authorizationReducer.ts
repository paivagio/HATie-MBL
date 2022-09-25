import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthorizationSlice = {
    isOwner: boolean;
    isModerator: boolean;
    groupPermissions: {
        canRead: boolean;
        canWrite: boolean;
        canDelete: boolean;
    };
}

const authorizationSlice = createSlice({
    name: 'authorization',
    initialState: {
        isOwner: false,
        isModerator: false,
        groupPermissions: {
            canRead: false,
            canWrite: false,
            canDelete: false
        }
    } as AuthorizationSlice,
    reducers: {
        setInstitutionPermissions: (state, action: PayloadAction<{ isOwner: boolean, isModerator: boolean }>) => {
            return { ...state, ...action.payload }
        },
        setGroupPermissions: (state, action: PayloadAction<{ canRead: boolean, canWrite: boolean, canDelete: boolean }>) => {
            return { ...state, groupPermissions: { ...action.payload } }
        },
    }
});

export const {
    setInstitutionPermissions,
    setGroupPermissions
} = authorizationSlice.actions

export default authorizationSlice.reducer