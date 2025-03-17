import { View, Text } from 'react-native';
import { useContext } from 'react';

import MyLanguageContext from '../utils/MyLanguageContext';
import { Button } from 'react-native-elements';
import BasicScreen from '../components/screenComponents/BasicScreen';

const logout = (navigation) => {
    return () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }], // Change 'Home' to your actual first screen name
        });
    };
};


const navigateToSettings = (navigation) => {
    return () => {
        navigation.navigate('Settings', { role: 'citizen' });
    };
};

export default function CitizenDashboard({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <BasicScreen title={DashboardTextCitizen[language].title}>
            <Button title="Logout" onPress={logout(navigation)} />
            <Button title="Settings" onPress={navigateToSettings(navigation)} />
            {/* <Text>{DashboardTextCitizen[language].title}</Text> */}
        </BasicScreen>
    );
}

const DashboardTextCitizen = {
    en: {
        title: 'Citizen',
    },
    he: {
        title: 'אזרח',
    },
};
