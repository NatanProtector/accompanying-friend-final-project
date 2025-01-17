import { View, Text } from 'react-native';
import { useContext } from 'react';

import MyLanguageContext from '../utils/MyLanguageContext';

export default function SecurityDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
            <Text>{DashboardTextSecurity[language].title}</Text>
        </View>
    );
}

const DashboardTextSecurity = {
    en: {
        title: 'Security Dashboard',
    },
    he: {
        title: 'דשבורד אבטחה',
    },
}
