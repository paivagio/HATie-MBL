export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined;
            signin: undefined;
            preferences: undefined;
            institutionDetails: { institutionId: string };
            groupDetails: { groupId: string };
            patientDetails: { patientId: string };
            summaryDetails: undefined;
            newRecording: undefined;
            // new: undefined;
            // details: { orderId: string };
        }
    }
}