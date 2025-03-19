import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const idNumber = "111111111"; // Replace with actual user's idNumber

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow location access.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("User Location:", location.coords);

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      // Send location to the backend using idNumber
      await updateUserLocation(location.coords.latitude, location.coords.longitude);
    };

    getLocationPermission();
  }, []);

  // Function to update user location in the database
  const updateUserLocation = async (latitude, longitude) => {
    try {
      const response = await axios.put(
        `http://192.168.144.21:3001/api/auth/update-location/${idNumber}`,
        { latitude, longitude }
      );
      console.log("Location updated:", response.data);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={region} title="Your Location" />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="teal" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: 500 },
  map: { width: "100%", height: "100%" },
});

export default MapScreen;
