import { View, Text, Settings } from 'react-native';
import { useContext } from 'react';

import getDayPeriod from '../../utils/getDayPeriod'
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyLanguageContext from '../../utils/MyLanguageContext';
// import { Button } from 'react-native-elements';
import BasicScreen from './BasicScreen';
import NavButton from '../general_components/NavButton';

const logout = (navigation) => {
  return async () => {
    await AsyncStorage.removeItem("userData");
setTimeout(() => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Home" }],
  });
}, 100); // Slight delay to allow `AsyncStorage.removeItem` to flush

  };
};


const navigateToSettings = (navigation) => {
    return () => {
        navigation.navigate('Settings', { role: 'citizen' });
    };
};

export default function DashboardScreen({ children, navigation }) {
    const { language } = useContext(MyLanguageContext);

    var title_time = null 
    const time_of_day = getDayPeriod();

    if (time_of_day === 0) {
        title_time = "title_morning"
    }
    else if (time_of_day === 1) {
        title_time = "title_afternoon"
    }
    else {
        title_time = "title_evening"
    }


    return (
        <BasicScreen title={DashboardText[language][title_time]} subtitle={DashboardText[language].subtitle} language={language}>
            {children}
            <NavButton title={DashboardText[language].Settings} onPress={navigateToSettings(navigation)} />
            <NavButton title={DashboardText[language].logout} onPress={logout(navigation)} />
        </BasicScreen>
    );
}

const DashboardText = {
    en: {
        title_morning: 'Good morning',
        title_afternoon: 'Good afternoon',
        title_evening: 'Good evening',
        subtitle: "<User name>",
        logout: "Logout",
        Settings: "Settings",
    },
    he: {
        title_morning: 'בוקר טוב',
        title_afternoon: 'צהריים טובים',
        title_evening: 'ערב טוב',
        subtitle: "<שם המשתמש>",
        logout: "התנתק",
        Settings: "הגדרות",
    },
};
