/** TODO:
 * - Implement screen lock and cancel option when request is pending, or too many request will crash the app
 * - (DriveScreen.js) seperate server updates on location adn display updates on map. they dont have to match.
 * - (DriveScreen.js) Getting location by cllicking map is handled completely differently then getting location
 *   by searching for and clicking an address, or by clicking the search button. standardize this.
 * - (DriveScreen.js) Clean the spaghetti code. sepreate to Map component to handle display (Done?) and MapController
 *   for handeling the maps functionality.
 * - (DriveScreen.js) Right now it will only center on the user, make center and drag listener to center on the camera without
 *   preventing the user from dragging the map.
 * - (DriveScreen.js) Sucurity needs to transmit location even when not in ride. (sepereate to securityDriveScreen and cityDriveScreen)
 *
 * BUGS:
 * - security user disconnects from sockets when navigating to settings screen (maybe ok? to reapply settings?)
 * - (HomeScreen.js) Multiple clickes on login at once will cause the app to crash.
 * - (DriveScreen.js) when title is too long, it does not look good, its behind the search button
 * - (DriveScreen.js) heading and location updated on map, every 5 seconds, which leads to choppy movement.
 * - (DriveScreen.js) many style issues
 * - (DriveScreen.js) The cancel in the search modal is canceling the ride.
 * - (DriveScreen.js) suggestion: make single state for inRide, and change other state via useEffect
 */

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
