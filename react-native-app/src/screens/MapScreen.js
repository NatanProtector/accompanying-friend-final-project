import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";
import MapView, { Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { getDistance } from "geolib";
import redMarker from '../../assets/markers/map-marker-svgrepo-com (1).png';
import greenMarker from '../../assets/markers/map-marker-svgrepo-com.png';
import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = "";
const SERVER_URL = "";
const idNumber = "111111111";

const MapScreen = ({markers, setMarkers, destination, setDestination}) => {
  const [region, setRegion] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const markerRefs = useRef({});

  if (GOOGLE_MAPS_API_KEY === "") {
    throw new Error ("Missing Google Maps API key");
  }

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

  // const updateUserLocation = async (latitude, longitude) => {
  //   try {
  //     const response = await axios.put(
  //       `${SERVER_URL}/api/auth/update-location/${idNumber}`,
  //       { latitude, longitude }
  //     );
  //     console.log("Location updated:", response.data);
  //   } catch (error) {
  //     console.error("Error updating location:", error);
  //   }
  // };


  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const addr = await getAddressFromCoords(latitude, longitude);
    const newMarker = {
      id: Math.random().toString(),
      latitude,
      longitude,
      address: addr,
      name: "Custom Marker", // optional for later
      description: "No description", // optional for later
    };
    setMarkers((prev) => [...prev, newMarker]);
    setDestination({ latitude, longitude });
  };

  const handleRemoveMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    setRouteSteps([]);
    setCurrentStepIndex(0);
    setSelectedMarker(null);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.searchToggleContainer}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Text style={styles.magnifyIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

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
      )} */}

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
              mode="DRIVING"
              region="il"
              onReady={(result) => {
                const steps = result.legs[0].steps;
                setRouteSteps(steps);
                setCurrentStepIndex(0);
              }}
            />
          )}

          <Marker coordinate={region} title="Your Location" pinColor="blue" />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              image={selectedMarkerId === marker.id ? greenMarker : redMarker}
              tracksViewChanges={false}
              ref={(ref) => {
                if (ref) markerRefs.current[marker.id] = ref;
              }}
              onPress={() => {
                setSelectedMarker(marker);
                setSelectedMarkerId(marker.id);
              }}
            />
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="teal" />
      )}

      {selectedMarker && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const { latitude, longitude } = selectedMarker;
              Linking.openURL(`google.navigation:q=${latitude},${longitude}`);
            }}
          >
            <Text style={styles.actionText}>🧭</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const { latitude, longitude } = selectedMarker;
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
            }}
          >
            <Text style={styles.actionText}>📍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveMarker(selectedMarker.id)}
          >
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Text style={styles.actionText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showInfoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMarker?.name || "Marker Info"}</Text>
            <Text>Description: {selectedMarker?.description || "N/A"}</Text>
            <Text>Address: {selectedMarker?.address || "Unknown"}</Text>
            <Text>Lat: {selectedMarker?.latitude.toFixed(6)}</Text>
            <Text>Lng: {selectedMarker?.longitude.toFixed(6)}</Text>
            <Button title="Close" onPress={() => setShowInfoModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: 630 },
  map: { flex: 1, width: "100%", height: "100%" },
  searchToggleContainer: {
    position: "absolute",
    top: 60,
    right: 10,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },
  magnifyIcon: { fontSize: 22 },
  inputContainer: {
    position: "absolute",
    top: 120,
    left: 0,
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
    top: 0,
    left: 0,
    width: "85%",
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
  actionBar: {
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 65,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 6,
    elevation: 6,
    zIndex: 1000,
  },
  actionButton: {
    padding: 10,
    alignItems: "center",
  },
  actionText: {
    fontSize: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default MapScreen;