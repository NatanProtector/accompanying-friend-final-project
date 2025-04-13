import { useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import MyLanguageContext from "../utils/MyLanguageContext";
import DashboardScreen from "../components/screen_components/DashboardScreen";
import NavButton from "../components/general_components/NavButton";
import * as Location from "expo-location";
import { SERVER_URL } from "@env";
import LocationTransmissionsToServer from "../utils/LocationTransmissionsToServer";


const LOCATION_UPDATE_INTERVAL = 5000;
const idNumber = '123456789';

export default function SecurityDashboard({ navigation }) {
  const { language } = useContext(MyLanguageContext);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    let locationIntervalId;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Security dashboard requires location access to function."
        );
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        locationIntervalId = setInterval(async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          } catch (updateError) {
            console.error("Error getting location update:", updateError);
          }
        }, LOCATION_UPDATE_INTERVAL);
      } catch (initialError) {
        console.error("Error getting initial location:", initialError);
        Alert.alert("Location Error", "Could not fetch initial location.");
      }
    };

    startLocationUpdates();

    return () => {
      if (locationIntervalId) {
        clearInterval(locationIntervalId);
      }
    };
  }, []);

  const handleBackgroundPress = () => {
    console.log("Background pressed");
  };

  return (
    <DashboardScreen navigation={navigation}>
      <LocationTransmissionsToServer
        userRole="security"
        userId={idNumber}
        location={currentLocation}
        serverUrl={SERVER_URL}
        updateInterval={LOCATION_UPDATE_INTERVAL}
        isEnabled={!!currentLocation}
      />

      <NavButton
        title={text[language].startRide}
        onPress={() => navigation.navigate("StartRide/Security")}
      />

      <NavButton
        title={text[language].putInBackground}
        onPress={handleBackgroundPress}
      />
    </DashboardScreen>
  );
}

const text = {
  en: {
    startRide: "Start Ride",
    putInBackground: "Put in Background",
  },
  he: {
    startRide: "התחלת נסיעה",
    putInBackground: "מצער אפליקציה",
  },
};
