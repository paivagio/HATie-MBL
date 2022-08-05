import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { Preferences } from '../screens/Preferences';
import { SignIn } from '../screens/SignIn';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="signin" component={SignIn} />
            <Screen name="home" component={Home} />
            <Screen name="preferences" component={Preferences} />
        </Navigator>
    )
}