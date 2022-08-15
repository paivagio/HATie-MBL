import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { InstitutionDetails } from '../screens/InstitutionDetails';
import { GroupDetails } from '../screens/GroupDetails';
import { Preferences } from '../screens/Preferences';
import { PatientDetails } from '../screens/PatientDetails';
import { SummaryDetails } from '../screens/SummaryDetails';
import { NewRecording } from '../screens/NewRecording';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="home" component={Home} />
            <Screen name="preferences" component={Preferences} />
            <Screen name="institutionDetails" component={InstitutionDetails} />
            <Screen name="groupDetails" component={GroupDetails} />
            <Screen name="patientDetails" component={PatientDetails} />
            <Screen name="summaryDetails" component={SummaryDetails} />
            <Screen name="newRecording" component={NewRecording} />
        </Navigator>
    )
}