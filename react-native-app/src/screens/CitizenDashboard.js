import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import DashboardScreen from '../components/screen_components/DashboardScreen'
import NavButton from '../components/general_components/NavButton';

export default function CitizenDashboard({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <DashboardScreen
            navigation={navigation}
        >
            <NavButton
                title={text[language].startRide}
                onPress={() => navigation.navigate('StartRide/Citizen')}
            />
            <NavButton
                title={text[language].safeLocations}
                onPress={() => navigation.navigate('SafeLocations')}
            />

        </DashboardScreen>
    );
}

const text = {
    en: {
        safeLocations: 'Show Safe Locations Near Me',
        startRide: 'Start Ride'
    },
    he: {
        safeLocations: 'הצגת מקומות בטוחים בקרבתי',
        startRide: 'התחלת נסיעה'
    }
}