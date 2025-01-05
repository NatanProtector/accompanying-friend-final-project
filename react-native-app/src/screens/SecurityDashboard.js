import { View, Text } from 'react-native';
import { useContext } from 'react';

import { DashboardTextSecurity } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function SecurityDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
            <Text>{DashboardTextSecurity[language].title}</Text>
        </View>
    );
}