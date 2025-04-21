import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import BasicScreenTemplate from "../components/screen_components/BasicScreenTemplate";
import NavigationHeader from "../components/screen_components/NavigationHeader";
import Map from "../components/map_components/Map";
import { getDistance } from "geolib";
import io from "socket.io-client";
import { GOOGLE_MAPS_API_KEY, SERVER_URL } from "@env";

import AsyncStorage from "@react-native-async-storage/async-storage";

const MAP_UPDATE_INTERVAL = 2500;
const LOCATION_UPDATE_INTERVAL = 5000;

export default function DriveScreen({
  initialDestination,
  userRole,
  idNumber,
}) {

  let mapIntervalId = null;
  let locationIntervalId = null;

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [destinationText, setDestinationText] = useState("");

  const socketRef = useRef(null);
  const markerRefs = useRef({});
  const [marker, setMarker] = useState(null);
  const [destination, setDestination] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [followUser, setFollowUser] = useState(false);
  const [userHeading, setUserHeading] = useState(null);

  const onMapReady = () => {
    if (initialDestination) {
      startDrive(initialDestination);
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      return `${place.street || ""} ${place.name || ""}, ${place.city || ""}`;
    } catch (error) {
      console.error("Error:", error);
      return "Unknown location";
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const addr = await getAddressFromCoords(latitude, longitude);
    const newMarker = {
      id: "1",
      latitude,
      longitude,
      address: addr,
      name: `(${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      description: "Your selected destination",
    };
    setMarker(newMarker);
    startDrive({ latitude, longitude });
  };

  const handleRemoveMarker = () => {
    setMarker(null);
    setRouteSteps([]);
    setCurrentStepIndex(0);
    setSelectedMarker(null);
  };

  const startDrive = (destination) => {
    setFollowUser(true);
    setDestination(destination);
  };

  const cancelDrive = () => {
    setRouteSteps([]);
    setCurrentStepIndex(0);
    setDestination(null);
    setMarker(null);
    setShowDirections(false);
    setFollowUser(false);
  };

  const handleResultSelect = async (result) => {
    try {
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.placeId}&key=${GOOGLE_MAPS_API_KEY}&language=en`
      );
      const detailsData = await detailsResponse.json();

      if (detailsData.result && detailsData.result.geometry) {
        const { lat, lng } = detailsData.result.geometry.location;
        const newMarker = {
          id: "1",
          latitude: lat,
          longitude: lng,
          name: result.name,
          description: result.description,
          address: result.address,
        };
        setModalVisible(false);
        setMarker(newMarker);
        setSearchResults([]);
        setSearchText("");
        startDrive({ latitude: lat, longitude: lng });
      } else {
        console.error("No geometry data in response");
      }
    } catch (error) {
      console.error("Error getting place details:", error);
      Alert.alert("Error", "Could not get location details. Please try again.");
    }
  };

  const handleSearchInputChange = async (text) => {
    setSearchText(text);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${GOOGLE_MAPS_API_KEY}&language=en&components=country:il`
      );
      const data = await response.json();
      if (data.predictions && data.predictions.length > 0) {
        const results = data.predictions.map((prediction, index) => ({
          id: index.toString(),
          name: prediction.structured_formatting.main_text,
          description: prediction.structured_formatting.secondary_text,
          address: prediction.description,
          placeId: prediction.place_id,
        }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to allow location access.");
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        if (!location || !location.coords) {
          console.warn("[DRIVE] No valid location object");
          return;
        }
  
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
  
        setRegion(newRegion);
  
        const stored = await AsyncStorage.getItem("userData");
        if (!stored) {
          console.warn("[DRIVE] No user data found in AsyncStorage");
          return;
        }
        const { idNumber } = JSON.parse(stored);
  
     // ✅ Update location in DB
     try {
      const response = await fetch(`${SERVER_URL}/api/auth/update-location/${idNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      });

      const responseText = await response.text();
      console.log("[DRIVE] Server response:", response.status, responseText);

      if (!response.ok) {
        console.warn("[DRIVE] Location update failed");
      } else {
        console.log("[DRIVE] Location sent to server");
      }
    } catch (error) {
      console.error("[DRIVE] Error sending location to server:", error);
    }

    // ✅ Socket (citizen only)
    if (userRole === "citizen") {
      socketRef.current = io(SERVER_URL);
      socketRef.current.on("connect", () => {
        socketRef.current.emit("register", {
          role: userRole,
          userId: idNumber,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });

        startLocationServerUpdates();
      });
    }

    // ✅ Start location updates for map regardless of role
    startLocationMapUpdates();
  } catch (err) {
    console.error("[DRIVE] Unexpected error in location permission flow:", err);
  }
};

getLocationPermission();

return () => {
  if (socketRef.current) {
    socketRef.current.disconnect();
  }
};
}, []);
  useEffect(() => {
    if (initialDestination) {
      console.log("[DRIVE] New initialDestination received:", initialDestination);
      startDrive(initialDestination);
  
      // Optionally center map immediately:
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: initialDestination.latitude,
        longitude: initialDestination.longitude,
      }));
    }
  }, [initialDestination]);
  
  

  const startLocationMapUpdates = async () => {
    try {

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        enableHighAccuracy: true,
        heading: true,
      });
      const { latitude, longitude, heading } = location.coords;
      setRegion((prevRegion) => ({ ...prevRegion, latitude, longitude }));

      mapIntervalId = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
          heading: true,
        });
        
         const { latitude, longitude, heading } = loc.coords;

        setRegion((prevRegion) => ({
          ...prevRegion,
          latitude,
          longitude,
        }));

       setUserHeading(heading);
        
      }, MAP_UPDATE_INTERVAL);

      return () => clearInterval(mapIntervalId);
    } catch (error) {
      console.error("Error updating location on map:", error);
    }
  };

  const startLocationServerUpdates = async () => {
    try {
      locationIntervalId = setInterval(async () => {
        // Fetch the current location *inside* the interval
        const currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
        });
        const { latitude, longitude } = currentLoc.coords;

        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("update_location", {
            latitude: latitude, // Use the fetched latitude
            longitude: longitude, // Use the fetched longitude
          });
        }
      }, LOCATION_UPDATE_INTERVAL);

      return () => clearInterval(locationIntervalId);
    } catch (error) {
      console.error("Error starting location server updates:", error);
    }
  };

  // Monitor user's position and update route steps when close to destination
  useEffect(() => {
    if (routeSteps.length === 0) return;

    const sub = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 3,
        enableHighAccuracy: true,
        heading: true,
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

  // Update destination text when route steps change
  useEffect(() => {
    if (routeSteps.length > 0 && marker) {
      setDestinationText(marker.name);
    } else {
      setDestinationText("");
    }
  }, [routeSteps, marker]);

  return (
    <BasicScreenTemplate
      HeaderComponent={
        <NavigationHeader
          DisplayComponent={
            routeSteps.length > 0 && (
              <View style={styles.navBox}>
                {/* <Text style={styles.distanceText}>
                  {routeSteps[currentStepIndex]?.distance?.text || ""}
                </Text> */}
                <Text style={styles.streetText}>
                  {routeSteps[currentStepIndex + 1]?.maneuver &&
                  routeSteps[currentStepIndex]?.distance?.text
                    ? `In ${
                        routeSteps[currentStepIndex].distance.text
                      }, ${routeSteps[currentStepIndex + 1].maneuver.replace(
                        /-/g,
                        " "
                      )}`
                    : ""}
                </Text>
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[styles.directionsButton, styles.driveButtons]}
                    onPress={() => setShowDirections(!showDirections)}
                  >
                    <Text style={styles.directionsButtonText}>
                      {showDirections
                        ? "Hide Directions"
                        : "Show All Directions"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cancelButton, styles.driveButtons]}
                    onPress={cancelDrive}
                  >
                    <Text style={styles.directionsButtonText}>
                      Cancel Drive
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        />
      }
      FooterComponent={
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>

          <Text style={styles.destinationText}>{destinationText}</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <Map
          markers={marker ? [marker] : []}
          setMarkers={(newMarkers) => setMarker(newMarkers[0] || null)}
          destination={destination}
          region={region}
          setRegion={setRegion}
          routeSteps={routeSteps}
          setRouteSteps={setRouteSteps}
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          showInfoModal={showInfoModal}
          setShowInfoModal={setShowInfoModal}
          selectedMarkerId={selectedMarkerId}
          setSelectedMarkerId={setSelectedMarkerId}
          showDirections={showDirections}
          setShowDirections={setShowDirections}
          markerRefs={markerRefs}
          handleMapPress={handleMapPress}
          handleRemoveMarker={handleRemoveMarker}
          followUser={followUser}
          userHeading={userHeading}
          onMapReady={onMapReady}
        />
      </View>

      {/* Search Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Location</Text>
            <View style={styles.modalInputs}>
              <TextInput
                style={styles.input}
                placeholder="Type your search..."
                value={searchText}
                onChangeText={handleSearchInputChange}
              />

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setSearchText("");
                  setSearchResults([]);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
              <ScrollView style={styles.searchResultsContainer}>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={styles.searchResultItem}
                    onPress={() => handleResultSelect(result)}
                  >
                    <Text style={styles.searchResultText}>{result.name}</Text>
                    <Text style={styles.searchResultSubtext}>
                      {result.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </BasicScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    overflow: "hidden",
  },
  searchButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
    backgroundColor: "#4958FF",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1001,
    minWidth: 50,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    fontSize: 24,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    top: "25%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "70%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: "100%",
  },
  modalInputs: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  searchResultsContainer: {
    width: "100%",
    maxHeight: 300,
    marginTop: 10,
    marginBottom: 10,
    overflow: "scroll",
  },
  cancelButton: {
    width: "30%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    marginLeft: 10,
    fontSize: 16,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  navBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    right: 20,
    padding: 15,
    borderRadius: 12,
  },
  streetText: {
    fontWeight: "bold",
    fontSize: 26,
    margin: 5,
    color: "white",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  driveButtons: {
    width: "50%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  directionsButton: {
    backgroundColor: "blue",
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  directionsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchResultItemPressed: {
    backgroundColor: "#f0f0f0",
  },
  searchResultText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  searchResultSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    position: "relative",
    zIndex: 1000,
  },
  destinationText: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginBottom: 15,
  },
});
