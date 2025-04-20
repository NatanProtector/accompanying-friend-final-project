import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import Register from "./src/screens/Register";
import RegistrationForm from "./src/screens/RegistrationForm";
import CitizenDashboard from "./src/screens/CitizenDashboard";
import SecurityDashboard from "./src/screens/SecurityDashboard";
import SettingsDisplay from "./src/screens/SettingsDisplay";
import CitizenDriveScreen from "./src/screens/CitizenDriveScreen";
import SecurityDriveScreen from "./src/screens/SecurityDriveScreen";
import SafeLocationScreen from "./src/screens/SafeLocationScreen";
import TestRoutesScreen from "./src/screens/TestRoutesScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useState } from "react";

import LanguageButtonWrapper from "./src/utils/LanguageButtonWrapper";
import BackButtonWrapper from "./src/utils/BackButtonWrapper";
import NotificationWrapper from "./src/utils/NotificationWrapper";

import MyLanguageContext from "./src/utils/MyLanguageContext";

import AccountRecoveryScreen from "./src/screens/AccountRecoveryScreen";

const Stack = createStackNavigator();

export default function App() {
  const [language, setLanguage] = useState("he");

  const switchLanguage = () => {
    setLanguage((lang) => (lang === "en" ? "he" : "en"));
  };

  /**Note:
   * Incosistent use of wrapScreenWithBackButton and wrapScreenLanguageButton,
   */

  const wrapScreenWithBackButton = (Component) => {
    return (props) => (
      <BackButtonWrapper>
        <Component {...props} />
      </BackButtonWrapper>
    );
  };

  const wrapScreenLanguageButton = (Component) => {
    return (props) => (
      <LanguageButtonWrapper
        title={language === "en" ? "עברית" : "English"}
        onClick={switchLanguage}
      >
        <Component {...props} />
      </LanguageButtonWrapper>
    );
  };

  const wrapScreenWithNotification = (Component) => {
    return (props) => (
      <NotificationWrapper>
        <Component {...props} />
      </NotificationWrapper>
    );
  };

  // Note: unecessary to have both wrappers
  const wrapScreenWithBoth = (Component) => {
    return (props) => (
      <BackButtonWrapper>
        <LanguageButtonWrapper
          title={language === "en" ? "עברית" : "English"}
          onClick={switchLanguage}
        >
          <Component {...props} />
        </LanguageButtonWrapper>
      </BackButtonWrapper>
    );
  };

  const options = {
    headerShown: false,
    cardStyle: { backgroundColor: "#FEFEFE" },
  };

  return (
    <MyLanguageContext.Provider value={{ language }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={wrapScreenLanguageButton(HomeScreen)}
            options={options}
          />
          <Stack.Screen
            name="Recovery"
            component={wrapScreenWithBoth(AccountRecoveryScreen)}
            options={options}
          />
          <Stack.Screen
            name="Login"
            component={wrapScreenWithBoth(LoginScreen)}
            options={options}
          />
          <Stack.Screen
            name="Register"
            component={wrapScreenWithBoth(Register)}
            options={options}
          />
          <Stack.Screen
            name="RegisterForm"
            component={wrapScreenWithBoth(RegistrationForm)}
            options={options}
          />
          <Stack.Screen
            name="Dashboard/Security"
            component={wrapScreenWithNotification(
              wrapScreenLanguageButton(SecurityDashboard)
            )}
            options={options}
          />
          <Stack.Screen
            name="Dashboard/Citizen"
            component={CitizenDashboard}
            options={options}
          />
          <Stack.Screen
            name="Settings"
            component={wrapScreenWithBoth(SettingsDisplay)}
            options={options}
          />
          <Stack.Screen
            name="StartRide/Citizen"
            component={wrapScreenWithBackButton(CitizenDriveScreen)}
            options={options}
          />
          <Stack.Screen
            name="StartRide/Security"
            component={wrapScreenWithBackButton(SecurityDriveScreen)}
            options={options}
          />
          <Stack.Screen
            name="SafeLocations"
            component={wrapScreenWithBackButton(SafeLocationScreen)}
            options={options}
          />

          <Stack.Screen
            name="TestRoutes"
            component={wrapScreenLanguageButton(TestRoutesScreen)}
            options={options}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MyLanguageContext.Provider>
  );
}
