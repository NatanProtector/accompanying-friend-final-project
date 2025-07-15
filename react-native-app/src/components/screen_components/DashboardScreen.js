import { View, Text, Settings } from "react-native";
import { useContext, useState, useEffect } from "react";

import getDayPeriod from "../../utils/getDayPeriod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyLanguageContext from "../../utils/MyLanguageContext";
// import { Button } from 'react-native-elements';
import BasicScreen from "./BasicScreen";
import NavButton from "../general_components/NavButton";

const logout = (navigation) => {
  return async () => {
    await AsyncStorage.removeItem("userData");
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }, 100); // Slight delay to allow `AsyncStorage.removeItem` to flush
  };
};

const navigateToSettings = (navigation) => {
  return () => {
    navigation.navigate("Settings", { role: "citizen" });
  };
};

export default function DashboardScreen({ children, navigation }) {
  const { language } = useContext(MyLanguageContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { fullName } = JSON.parse(userData);
          setUsername(fullName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  var title_time = null;
  const time_of_day = getDayPeriod();

  if (time_of_day === 0) {
    title_time = "title_morning";
  } else if (time_of_day === 1) {
    title_time = "title_afternoon";
  } else {
    title_time = "title_evening";
  }

  return (
    <BasicScreen
      title={DashboardText[language][title_time]}
      subtitle={username}
      language={language}
    >
      {children}
      <NavButton
        title={DashboardText[language].Settings}
        onPress={navigateToSettings(navigation)}
        icon="settings"
        language={language}
      />
      <NavButton
        title={DashboardText[language].logout}
        onPress={logout(navigation)}
        icon="logout"
        language={language}
      />
    </BasicScreen>
  );
}

const DashboardText = {
  en: {
    title_morning: "Good morning",
    title_afternoon: "Good afternoon",
    title_evening: "Good evening",
    logout: "Logout",
    Settings: "Settings",
  },
  he: {
    title_morning: "בוקר טוב",
    title_afternoon: "צהריים טובים",
    title_evening: "ערב טוב",
    logout: "התנתק",
    Settings: "הגדרות",
  },
};
