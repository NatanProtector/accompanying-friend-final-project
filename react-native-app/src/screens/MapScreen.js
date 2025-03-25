import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import axios from "axios";
import { getDistance } from "geolib";

const GOOGLE_MAPS_API_KEY = ""; // Replace with your key
const SERVER_URL = ""; // Replace with your backend IP & port
const idNumber = "111111111"; // Replace with actual logged-in user’s idNumber

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow location access.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      await updateUserLocation(location.coords.latitude, location.coords.longitude);
    };

    getLocationPermission();
  }, []);

  // Real-time step tracking
  useEffect(() => {
    if (routeSteps.length === 0) return;

    const sub = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 3 },
      (location) => {
        const { latitude, longitude } = location.coords;
        const step = routeSteps[currentStepIndex];
        if (!step) return;

        const dist = getDistance(
          { latitude, longitude },
          {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
          }
        );

        if (dist < 15 && currentStepIndex < routeSteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }
    );

    return () => sub.then((s) => s.remove());
  }, [routeSteps, currentStepIndex]);

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

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      return `${place.name || ""} ${place.street || ""}, ${place.city || ""}`;
    } catch (error) {
      return "Unknown location";
    }
  };

  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const addr = await getAddressFromCoords(latitude, longitude);
    const newMarker = {
      id: Math.random().toString(),
      latitude,
      longitude,
      address: addr,
    };
    setMarkers([...markers, newMarker]);
    setDestination({ latitude, longitude });
  };

  const handleRemoveMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    setRouteSteps([]);
    setCurrentStepIndex(0);
  };

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

      const { latitude, longitude } = location[0];
      const addr = await getAddressFromCoords(latitude, longitude);
      const newMarker = {
        id: Math.random().toString(),
        latitude,
        longitude,
        address: addr,
      };
      setMarkers([...markers, newMarker]);
      setDestination({ latitude, longitude });
      setAddress("");
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Magnifier Toggle */}
      <View style={styles.searchToggleContainer}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Text style={styles.magnifyIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* 📍 Address Input */}
      {showSearch && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />
          <Button title="Add Marker" onPress={handleAddMarkerByAddress} />
        </View>
      )}

      {/* 🧭 Navigation Box */}
      {routeSteps.length > 0 && (
        <View style={styles.navBox}>
          <Text style={styles.distanceText}>
            {routeSteps[currentStepIndex]?.distance?.text || ""}
          </Text>
          <Text style={styles.streetText}>
            {stripHtml(routeSteps[currentStepIndex]?.html_instructions || "")}
          </Text>
        </View>
      )}

      {/* 🗺️ Map */}
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {destination && (
            <MapViewDirections
              origin={region}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="blue"
              language="he"
              onReady={(result) => {
                const steps = result.legs[0].steps;
                setRouteSteps(steps);
                setCurrentStepIndex(0);
              }}
            />
          )}

          <Marker coordinate={region} title="Your Location" />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.address}
              description="Tap to remove"
              onPress={() => handleRemoveMarker(marker.id)}
            />
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="teal" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  map: { flex: 1, width: "100%", height: "100%" },
  searchToggleContainer: {
    position: "absolute",
    top: 0,
    right: 20,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },
  magnifyIcon: { fontSize: 22 },
  inputContainer: {
    position: "absolute",
    top: 140,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
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
  navBox: {
    position: "absolute",
    top:0,
    left: 20,
    right: 20,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 12,
    zIndex: 999,
  },
  distanceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  streetText: {
    fontSize: 18,
    color: "#00aaff",
  },
});

export default MapScreen;

