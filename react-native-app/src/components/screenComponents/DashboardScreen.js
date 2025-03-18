import { View, Text, Settings } from 'react-native';
import { useContext } from 'react';

import getDayPeriod from '../../utils/getDayPeriod'

import MyLanguageContext from '../../utils/MyLanguageContext';
import { Button } from 'react-native-elements';
import BasicScreen from './BasicScreen';
import NavButton from '../components/NavButton';

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
        console.log("Navigating to Settings");
        
        // navigation.navigate('Settings', { role: 'citizen' });
    };
};

export default function DashboardScreen({ children, navigation }) {
    const { language } = useContext(MyLanguageContext);

    const title_time = getDayPeriod() == 0? "title_morning" : "title_evening";

    return (
        <BasicScreen title={DashboardText[language][title_time]} subtitle={DashboardText[language].subtitle}>
            {children}
            <NavButton title={DashboardText[language].Settings} onPress={navigateToSettings(navigation)} />
            <NavButton title={DashboardText[language].logout} onPress={logout(navigation)} />
        </BasicScreen>
    );
}

const DashboardText = {
    en: {
        title_morning: 'Good morning',
        title_evening: 'Good evening',
        subtitle: "<User name>",
        logout: "Logout",
        Settings: "Settings",
    },
    he: {
        title_morning: 'בוקר טוב',
        title_evening: 'ערב טוב',
        subtitle: "<שם המשתמש>",
        logout: "התנתק",
        Settings: "הגדרות",
    },
};
