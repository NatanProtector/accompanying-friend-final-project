import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import MyLanguageContext from '../utils/MyLanguageContext';
import BasicScreen from '../components/screen_components/BasicScreen';
import NavButton from '../components/components/NavButton';

export default function Register({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <BasicScreen title={RegisterText[language].title} language={language}>
            <Text style={styles.text}>
                {RegisterText[language].prompt}
            </Text>
            
            
            <NavButton
                title={RegisterText[language].citizen}
                onPress={() => navigation.navigate('RegisterForm', { registerAs: 'citizen' })}
                // buttonStyle={styles.button}
            />
            
            <NavButton
                title={RegisterText[language].security}
                onPress={() => navigation.navigate('RegisterForm', { registerAs: 'security' })}
                // buttonStyle={styles.button}
            />
        </BasicScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginVertical: 5,
        width: 200,
    },
    
});

const RegisterText = {
    en: {
        title: 'Register',
        prompt: 'You are registering as a..',
        citizen: 'Register as Citizen',
        security: 'Register as Security',
    },
    he: {
        title: 'הרשמה',
        prompt: 'אתם נרשמים בתור..',
        citizen: 'רישום אזרח',
        security: 'רישום אבטחה',
    },
};
