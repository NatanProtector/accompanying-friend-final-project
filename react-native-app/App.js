// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreens';
import Register from './src/screens/Register';
import RegistrationForm from './src/screens/RegistrationForm';
import CitizenDashboard from './src/screens/CitizenDashboard';
import SecurityDashboard from './src/screens/SecurityDashboard';
import SettingsDisplay from './src/screens/SettingsDisplay';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useState } from 'react';

import ButtonWrapper from './src/utils/ButtonWrapper';

import MyLanguageContext from './src/utils/MyLanguageContext';

const Stack = createStackNavigator();

export default function App() {

  const [language, setLanguage] = useState('en');

  const switchLanguage = () => {
    setLanguage((lang) => (lang === 'en' ? 'he' : 'en'));
  }

  const wrapScreen = (Component) => {
    return (props) => (
      <ButtonWrapper title={language === 'en' ? 'עברית' : 'English'} onClick={switchLanguage}>
        <Component {...props} />
      </ButtonWrapper>
    );
  }

  return (
    <MyLanguageContext.Provider value={{ language }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={wrapScreen(HomeScreen)} options={{title: NavigationText[language].home}}/>
          <Stack.Screen name="Login" component={wrapScreen(LoginScreen)} options={{title: NavigationText[language].login}}/>
          <Stack.Screen name="Register" component={wrapScreen(Register)} options={{title: NavigationText[language].register}}/>
          <Stack.Screen name ="RegisterForm" component={wrapScreen(RegistrationForm)} options={{title: NavigationText[language].registerForm}}/>
          <Stack.Screen name="Dashboard/Security" component={SecurityDashboard} options={{ headerShown: false }}/>
          <Stack.Screen name="Dashboard/Citizen" component={CitizenDashboard} options={{ headerShown: false }}/>
          <Stack.Screen name="Settings" component={SettingsDisplay} options={{title: NavigationText[language].settings}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </MyLanguageContext.Provider>
  );
}

const NavigationText = {
  en: {
      home: 'Welcome!',
      login: 'Login',
      register: 'Register',
      registerForm: 'Register Form',
      dashboardSecurity: 'Security Dashboard',
      dashboardCitizen: 'Citizen Dashboard',
      settings: 'Settings',
  },
  he: {
      home: '!ברוכים הבאים',
      login: 'כניסה',
      register: 'רישום',
      registerForm: 'טופס הרשמה',
      dashboardSecurity: 'אבטחה',
      dashboardCitizen: 'אזרח',
      settings: 'הגדרות',
  }
}