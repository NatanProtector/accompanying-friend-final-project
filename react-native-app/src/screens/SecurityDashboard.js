import { useContext, useEffect, useRef } from "react";
import { Alert } from "react-native";
import MyLanguageContext from "../utils/MyLanguageContext";
import DashboardScreen from "../components/screen_components/DashboardScreen";
import NavButton from "../components/general_components/NavButton";
import * as Location from "expo-location";
import { SERVER_URL } from "@env";
import io from "socket.io-client";

const LOCATION_UPDATE_INTERVAL = 5000;
const idNumber = "123456789";

export default function SecurityDashboard({ navigation }) {
  const { language } = useContext(MyLanguageContext);
  const socketRef = useRef(null);

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
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
          heading: true,
        });

        // Connect to the Socket.io server and register the user
        socketRef.current = io(SERVER_URL);

        socketRef.current.on("connect", () => {
          socketRef.current.emit("register", {
            role: "security",
            userId: idNumber,
            location: {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
          });

          // Start transmitting location
          startLocationServerUpdates();
        });
      } catch (initialError) {
        console.error("Error getting initial location:", initialError);
        Alert.alert("Location Error", "Could not fetch initial location.");
      }
    };

    startLocationUpdates();

    // Cleanup function
    return () => {
      if (locationIntervalId) {
        clearInterval(locationIntervalId);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected on component unmount");
      }
    };
  }, []);

  const startLocationServerUpdates = () => {
    locationIntervalId = setInterval(async () => {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
          heading: true,
        });
        socketRef.current.emit("update_location", {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (updateError) {
        console.error("Error getting location update:", updateError);
      }
    }, LOCATION_UPDATE_INTERVAL);
  };

  const handleBackgroundPress = () => {
    console.log("Background pressed");
  };

  return (
    <DashboardScreen navigation={navigation}>
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
