import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]); // Stores manually added markers
  const [address, setAddress] = useState(""); // Input for address-based marker
  const idNumber = "111111111"; // Replace with actual user's idNumber
  const SERVER_URL = "http://192.168.144.21:3001"; // Replace with your backend server IP & port

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
        `${SERVER_URL}/api/auth/update-location/${idNumber}`,
        { latitude, longitude }
      );
      console.log("Location updated:", response.data);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Function to add a marker when tapping on the map
  const handleMapPress = (event) => {
    const newMarker = {
      id: Math.random().toString(),
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };
    setMarkers([...markers, newMarker]);
  };

  // Function to add a marker by entering an address
  const handleAddMarkerByAddress = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter an address.");
      return;
    }

    try {
      const location = await Location.geocodeAsync(address);
      if (location.length === 0) {
        Alert.alert("Error", "Address not found.");
        return;
      }

      const newMarker = {
        id: Math.random().toString(),
        latitude: location[0].latitude,
        longitude: location[0].longitude,
      };
      setMarkers([...markers, newMarker]);
      setAddress(""); // Clear input after adding marker
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  return (
    <View style={styles.container}>
      {region ? (
        <>
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            onPress={handleMapPress} // Add marker when user taps
          >
            {/* Display the user's location */}
            <Marker coordinate={region} title="Your Location" />

            {/* Display manually added markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title="Custom Marker"
              />
            ))}
          </MapView>

          {/* Input box to add marker via address */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
            />
            <Button title="Add Marker" onPress={handleAddMarkerByAddress} />
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="teal" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  map: { width: "100%", height: "100%" },
  inputContainer: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default MapScreen;
