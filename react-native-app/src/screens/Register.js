import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

import MyLanguageContext from '../utils/MyLanguageContext';
import BasicScreen from '../components/screenComponents/BasicScreen';

export default function Register({ navigation }) {
    const { language } = useContext(MyLanguageContext);

    return (
        <BasicScreen title={RegisterText[language].title} language={language}>
            <Card containerStyle={styles.card}>
                <Text style={styles.text}>{RegisterText[language].prompt}</Text>
                <Card.Divider />
                <Button
                    title={RegisterText[language].citizen}
                    onPress={() => navigation.navigate('RegisterForm', { registerAs: 'citizen' })}
                    buttonStyle={styles.button}
                />
                <Button
                    title={RegisterText[language].security}
                    onPress={() => navigation.navigate('RegisterForm', { registerAs: 'security' })}
                    buttonStyle={styles.button}
                />
            </Card>
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
        marginVertical: 10,
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
        prompt: 'אתה נרשם בתור..',
        citizen: 'רישום אזרח',
        security: 'רישום אבטחה',
    },
};
