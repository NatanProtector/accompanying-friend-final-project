import { useContext } from "react";
import MyLanguageContext from "../utils/MyLanguageContext";
import DashboardScreen from "../components/screen_components/DashboardScreen";
import NavButton from "../components/general_components/NavButton";

export default function CitizenDashboard({ navigation }) {
  const { language } = useContext(MyLanguageContext);

  return (
    <DashboardScreen navigation={navigation}>
      <NavButton
        title={text[language].startRide}
        onPress={() => navigation.navigate("StartRide/Citizen")}
        icon="directions-car"
        language={language}
      />
      <NavButton
        title={text[language].safeLocations}
        onPress={() => navigation.navigate("SafeLocations")}
        icon="location-on"
        language={language}
      />
    </DashboardScreen>
  );
}

const text = {
  en: {
    safeLocations: "Danger Map",
    startRide: "Start Ride",
  },
  he: {
    safeLocations: "מפת סכנות",
    startRide: "התחלת נסיעה",
  },
};
