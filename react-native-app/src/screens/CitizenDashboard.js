import { View, Text } from 'react-native';
import { useContext } from 'react';

import { DashboardTextCitizen } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function CitizenDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
            <Text>{DashboardTextCitizen[language].title}</Text>
        </View>
    );
}