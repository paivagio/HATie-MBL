export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined;
            signin: undefined;
            signup: undefined;
            resetPassword: undefined;
            preferences: undefined;
            invitations: undefined;
            institutionDetails: { institutionId: string, isOwner: boolean, memberId?: string, memberPermissions?: number };
            groupDetails: { groupId: string, groupMemberId: string };
            patientDetails: { patientId: string, patientTitle: string, groupId: string, groupMemberId: string };
            summaryDetails: { summaryId: string, summaryTitle: string };
            newRecording: { patientId: string, patientTitle: string, groupId: string, groupMemberId: string };
            newInstitution: { ownerId: string };
            newGroup: { institutionId: string };
            addPatientToGroup: { groupId: string, institutionId: string };
            manageInstitution: { institutionId: string };
            managePatients: { institutionId: string };
            editPatient: { patientId: string };
            newPatient: { institutionId: string };
            manageMembers: { institutionId: string };
            editMember: { memberId: string, institutionId: string };
            newMember: { institutionId: string };
            manageGroup: { groupId: string };
            manageGroupMembers: { groupId: string };
        }
    }
}