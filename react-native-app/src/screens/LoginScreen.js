import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyLanguageContext from '../utils/MyLanguageContext';
import BasicScreen from '../components/screen_components/BasicScreen';
import NavButton from '../components/components/NavButton';

export default function LoginScreen({ navigation, route }) {
    const { language } = useContext(MyLanguageContext);
    const multiRole = route?.params?.multiRole || [];

    return (
        <BasicScreen title={LoginText[language].title} language={language}>
          <View style={styles.buttonGroup}>
            <Text style={styles.text}>{LoginText[language].prompt}</Text>
            {multiRole.includes('citizen') && (
              <NavButton
                title={LoginText[language].citizen}
                onPress={() => navigation.navigate('Dashboard/Citizen')}
              />
            )}
            {multiRole.includes('security') && (
              <NavButton
                title={LoginText[language].security}
                onPress={() => navigation.navigate('Dashboard/Security')}
              />
            )}
          </View>
        </BasicScreen>
      );
}

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
    roleButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginVertical: 5,
        width: 200,
    },
    text: {
        fontSize: 18,
    }
});

const LoginText = {
    en: {
        title: 'Role',
        prompt: 'Which role are you logging into?',
        security: 'Security',
        citizen: 'Citizen',
    },
    he: {
        title: 'תפקיד',
        prompt: 'בתור איזה תפקיד אתם נכנסים למערכת?',
        security: 'אבטחה',
        citizen: 'אזרח',
    },
};