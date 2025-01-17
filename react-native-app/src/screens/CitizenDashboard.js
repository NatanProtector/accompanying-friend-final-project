import { View, Text } from 'react-native';
import { useContext } from 'react';

import MyLanguageContext from '../utils/MyLanguageContext';

export default function CitizenDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
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