import React, { useEffect, useRef } from "react";
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
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { getDistance } from "geolib";
import redMarker from "../../../assets/markers/map-marker-svgrepo-com (1).png";
import greenMarker from "../../../assets/markers/map-marker-svgrepo-com.png";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import DriverDirections from "../general_components/DriverDirections";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.1.228:3001";
const idNumber = "111111111";

const MapScreen = ({
  markers,
  destination,
  region,
  setRegion,
  routeSteps,
  setRouteSteps,
  currentStepIndex,
  setCurrentStepIndex,
  selectedMarker,
  setSelectedMarker,
  showInfoModal,
  setShowInfoModal,
  selectedMarkerId,
  setSelectedMarkerId,
  showDirections,
  markerRefs,
  handleMapPress,
  handleRemoveMarker,
  followUser,
  userHeading,
}) => {
  const socketRef = useRef(null);
  const mapRef = useRef(null);

  // if (GOOGLE_MAPS_API_KEY == "")
  //   throw new Error ("Missing Google Maps API key");

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

      // Connect to the Socket.io server and register the user
      socketRef.current = io(SERVER_URL);

      socketRef.current.emit("register", {
        role: "user",
        userId: idNumber,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      // Start transmitting location every five seconds
      startLocationTransmission();
    };

    getLocationPermission();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect socket on unmount
      }
    };
  }, []);

  const startLocationTransmission = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        enableHighAccuracy: true,
        heading: true,
      });
      const { latitude, longitude, heading } = location.coords;

      // Set region only ONCE, during initial setup
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));

      // Emit initial location
      if (socketRef.current) {
        socketRef.current.emit("update_location", { latitude, longitude });
      }

      // Start location updates every 5 seconds
      const intervalId = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
          heading: true,
        });
        const { latitude, longitude, heading } = loc.coords;

        // Send location update
        if (socketRef.current) {
          socketRef.current.emit("update_location", { latitude, longitude });
        }
      }, 5000);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error transmitting location:", error);
    }
  };

  useEffect(() => {
    if (routeSteps.length === 0) return;

    const sub = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 3,
        enableHighAccuracy: true,
        heading: true, // Enable heading tracking
      },
      (location) => {
        const { latitude, longitude, heading } = location.coords;
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

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      return `${place.street || ""} ${place.name || ""} , ${place.city || ""}`;
    } catch (error) {
      return "Unknown location";
    }
  };

  return (
    <View style={styles.container}>
      {showDirections && routeSteps.length > 0 && (
        <View style={styles.directionsContainer}>
          <DriverDirections
            steps={routeSteps}
            currentStepIndex={currentStepIndex}
          />
        </View>
      )}

      {region ? (
        <MapView
          initialRegion={region}
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          onPress={handleMapPress}
          reuseMap={true}
          loadingEnabled={true}
          loadingBackgroundColor="white"
          loadingIndicatorColor="teal"
          showsMyLocationButton={true}
          showsCompass={true}
          showsUserHeadingIndicator={true}
          followsUserLocation={followUser}
          showsHeadingIndicator={true}
          userLocationCalloutEnabled={true}
          userLocationPriority="high"
          userLocationUpdateInterval={1000}
          onUserLocationChange={(event) => {
            if (followUser) {
              const { coordinate } = event.nativeEvent;
              const newRegion = {
                ...region,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
              };
              setRegion(newRegion);

              // Animate camera to new location with heading
              if (mapRef.current) {
                mapRef.current.animateCamera({
                  center: {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                  },
                  heading: userHeading || 0,
                  pitch: 45,
                  zoom: 17,
                  duration: 1000,
                });
              }
            }
          }}
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
              units="metric"
              onReady={(result) => {
                const steps = result.legs[0].steps;
                setRouteSteps(steps);
                setCurrentStepIndex(0);
              }}
              optimizeWaypoints={true}
              resetOnChange={false}
              precision="high"
              // SUS????? AI wrote this, seems to be good but, dont know if its necessary
              waypoints={[]}
              splitWaypoints={false}
              timePrecision="now"
              directionsServiceBaseUrl="https://maps.googleapis.com/maps/api/directions/json"
              directionsServiceOptions={{
                alternatives: false,
                avoid: [],
                language: "he",
                region: "il",
                units: "metric",
                mode: "driving",
                traffic_model: "best_guess",
                departure_time: "now",
                arrival_time: null,
                waypoints: [],
                optimize: false,
                avoid_ferries: false,
                avoid_highways: false,
                avoid_tolls: false,
                transit_mode: [],
                transit_routing_preference: null,
              }}
            />
          )}

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
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
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
              );
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
            <Text style={styles.modalTitle}>
              {selectedMarker?.name || "Marker Info"}
            </Text>
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
  directionsContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
});

export default MapScreen;
