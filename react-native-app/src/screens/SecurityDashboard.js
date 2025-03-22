import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import DashboardScreen from '../components/screen_components/DashboardScreen'

export default function CitizenDashboard({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <DashboardScreen
            navigation = {navigation}
        >

        </DashboardScreen>
    );
}

