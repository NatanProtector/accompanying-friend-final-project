import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import DashboardScreen from '../components/screenComponents/DashboardScreen'

export default function CitizenDashboard({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <DashboardScreen
            navigation = {navigation}
        >

        </DashboardScreen>
    );
}

