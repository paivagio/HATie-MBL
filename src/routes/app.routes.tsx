import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { InstitutionDetails } from '../screens/InstitutionDetails';
import { GroupDetails } from '../screens/GroupDetails';
import { Preferences } from '../screens/Preferences';
import { PatientDetails } from '../screens/PatientDetails';
import { SummaryDetails } from '../screens/SummaryDetails';
import { NewRecording } from '../screens/NewRecording';
import { Invitations } from '../screens/Invitations';
import { NewInstitution } from '../screens/NewInstitution';
import { NewGroup } from '../screens/NewGroup';
import { AddPatientToGroup } from '../screens/AddPatientToGroup';
import { ManageInstitution } from '../screens/ManageInstitution';
import { ManagePatients } from '../screens/ManagePatients';
import { NewPatient } from '../screens/NewPatient';
import { EditPatient } from '../screens/EditPatient';
import { ManageMembers } from '../screens/ManageMembers';
import { NewMember } from '../screens/NewMember';
import { ManageGroup } from '../screens/ManageGroup';
import { ManageGroupMembers } from '../screens/ManageGroupMembers';
import { EditMember } from '../screens/EditMember';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="home" component={Home} />
            <Screen name="preferences" component={Preferences} />
            <Screen name="invitations" component={Invitations} />
            <Screen name="institutionDetails" component={InstitutionDetails} />
            <Screen name="groupDetails" component={GroupDetails} />
            <Screen name="patientDetails" component={PatientDetails} />
            <Screen name="summaryDetails" component={SummaryDetails} />
            <Screen name="newRecording" component={NewRecording} />
            <Screen name="newInstitution" component={NewInstitution} />
            <Screen name="newGroup" component={NewGroup} />
            <Screen name="addPatientToGroup" component={AddPatientToGroup} />
            <Screen name="manageInstitution" component={ManageInstitution} />
            <Screen name="managePatients" component={ManagePatients} />
            <Screen name="newPatient" component={NewPatient} />
            <Screen name="editPatient" component={EditPatient} />
            <Screen name="manageMembers" component={ManageMembers} />
            <Screen name="editMember" component={EditMember} />
            <Screen name="newMember" component={NewMember} />
            <Screen name="manageGroup" component={ManageGroup} />
            <Screen name="manageGroupMembers" component={ManageGroupMembers} />
        </Navigator>
    )
}