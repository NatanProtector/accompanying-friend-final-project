// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreens';
import Register from './src/screens/Register';
import RegistrationForm from './src/screens/RegistrationForm';
import CitizenDashboard from './src/screens/CitizenDashboard';
import SecurityDashboard from './src/screens/SecurityDashboard';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useState } from 'react';

import ButtonWrapper from './src/utils/ButtonWrapper';

import MyLanguageContext from './src/utils/MyLanguageContext';
import { NavigationText } from './src/constants/text';

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
          <Stack.Screen name="Dashboard/Security" component={wrapScreen(SecurityDashboard)} options={{title: NavigationText[language].dashboardSecurity}}/>
          <Stack.Screen name="Dashboard/Citizen" component={wrapScreen(CitizenDashboard)} options={{title: NavigationText[language].dashboardCitizen}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </MyLanguageContext.Provider>
  );
}


