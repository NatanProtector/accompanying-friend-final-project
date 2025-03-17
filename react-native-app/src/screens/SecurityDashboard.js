import { View, Text } from 'react-native';
import { useContext } from 'react';
import { Button } from 'react-native-elements';
import MyLanguageContext from '../utils/MyLanguageContext';

const logout = (navigation) => {
    return () => {navigation.goBack()}
}

const navigateToSettings = (navigation, role) => {
    return () => {navigation.navigate('Settings', { role: role })}
}

export default function SecurityDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View>
            <Button title="Logout" onPress={logout(navigation, 'security')} />
            <Button title="Settings" onPress={navigateToSettings} />
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
