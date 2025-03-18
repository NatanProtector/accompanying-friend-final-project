import { useContext } from 'react';

import MyLanguageContext from '../utils/MyLanguageContext';

import DashboardScreen from '../components/screenComponents/DashboardScreen'

import {Text} from 'react-native'

// const logout = (navigation) => {
//     return () => {
//         navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' }], // Change 'Home' to your actual first screen name
//         });
//     };
// };


// const navigateToSettings = (navigation) => {
//     return () => {
//         navigation.navigate('Settings', { role: 'citizen' });
//     };
// };

export default function CitizenDashboard({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <DashboardScreen
            navigation = {navigation}
        >
            <Text>
                Citizen
            </Text>

        </DashboardScreen>
    );
}

