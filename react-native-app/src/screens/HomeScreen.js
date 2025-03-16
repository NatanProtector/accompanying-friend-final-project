import { StyleSheet } from 'react-native';
import { Card,Button } from 'react-native-elements';
import {useContext} from 'react';
// import {HomeText} from '../constants/text';  
import MyLanguageContext from '../utils/MyLanguageContext';
import BasicScreen from '../components/screenComponents/BasicScreen';

export default function HomeScreen({ navigation }) {    

    const {language} = useContext(MyLanguageContext);

    return (
        <BasicScreen style={style.container} title={HomeText[language].title} subtitle={HomeText[language].subtitle}>
            <Card title={HomeText[language].title}>
                <Button
                    title={HomeText[language].login}
                    onPress={() => console.log('Navigating to Login')}
                />
                <Button
                    title={HomeText[language].register}
                    onPress={() => console.log('Navigating to Register')}
                />
            </Card>
        </BasicScreen>
    );
}

const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
});

const HomeText = {
    en: {
        title: 'Login',
        subtitle: 'Always with you - anywhere, anytime',
        login: 'Login',
        register: 'Register',
    },
    he: {
        title: 'כניסה',
        subtitle: 'תמיד איתך - בכל מקום, בכל שעה',
        login: 'התחבר',
        register: 'הרשם',
    }
}