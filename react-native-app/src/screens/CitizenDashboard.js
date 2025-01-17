import { View, Text } from 'react-native';
import { useContext } from 'react';

import MyLanguageContext from '../utils/MyLanguageContext';
import { Button } from 'react-native-elements';

const logout = (navigation) => {
    return () => {
        navigation.goBack()
    }
}

const navigateToSettings = (navigation) => {
    return () => {
        navigation.navigate('Settings', { role: 'citizen' })
    }
}

export default function CitizenDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
            <Button title="Logout" onPress={logout(navigation)} />
            <Button title="Settings" onPress={navigateToSettings(navigation)} />
            <Text>{DashboardTextCitizen[language].title}</Text>
        </View>
    );
}

const DashboardTextCitizen = {
    en: {
        title: 'Citizen Dashboard',
    },
    he: {
        title: 'דשבורד אזרח',
    },
}