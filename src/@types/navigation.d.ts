export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined;
            signin: undefined;
            preferences: undefined;
            institutionDetails: { institutionId: string };
            groupDetails: { groupId: string };
            patientDetails: { patientId: string, patientTitle: string };
            summaryDetails: { summaryId: string };
            newRecording: { patientId: string, patientTitle: string };
            // new: undefined;
            // details: { orderId: string };
        }
    }
}