import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import DashboardScreen from '../components/screen_components/DashboardScreen'
import NavButton from '../components/general_components/NavButton';

export default function CitizenDashboard({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    const handleBackgroundPress = () => {
        console.log("Background pressed");
    };

    return (
        <DashboardScreen
            navigation = {navigation}
        >

            <NavButton
                title={text[language].startRide}
                onPress={() => navigation.navigate("StartRide/Security")}
            />

            <NavButton
                title={text[language].putInBackground}
                onPress={handleBackgroundPress}
            />

        </DashboardScreen>
    );
}

const text = {
    en: {
        startRide: "Start Ride",
        putInBackground: "Put in Background",
    },
    he: {
        startRide: "התחלת נסיעה",
        putInBackground: "מצער אפליקציה",
    },
};

