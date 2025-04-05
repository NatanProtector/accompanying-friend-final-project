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
import { useState, useEffect, useRef, useContext } from "react";
import BasicScreenTemplate from "../components/screen_components/BasicScreenTemplate";
import NavigationHeader from "../components/screen_components/NavigationHeader";
import Map from "../components/map_components/Map";
import { getDistance } from "geolib";
import io from "socket.io-client";
import { GOOGLE_MAPS_API_KEY } from "@env";
import DriveController from "../components/map_components/DriveController";
// import MyLanguageContext from "../utils/MyLanguageContext";

const SERVER_URL = "http://192.168.1.228:3001";
const idNumber = "111111111";

/**
 * BUG:
 * - when title is too long, it does not look good, its behind the search button
 * - heading and location updated on map, every 5 seconds, which leads to choppy movement.
 * - many style issues
 *
 * TODO:
 * - seperate server updates on location adn display updates on map. they dont have to match.
 * - Getting location by cllicking map is handled completely differently then getting location
 *   by searching for and clicking an address, or by clicking the search button. standardize this.
 * - Clean the spaghetti code. sepreate to Map component to handle display (Done?) and MapController
 *   for handeling the maps functionality.
 */

export default function DriveScreen() {
  const { functions, states, setStates } = DriveController();

  const {
    handleMapPress,
    handleRemoveMarker,
    startDrive,
    cancelDrive,
  } = functions;
  
  const {
    marker,
    destination,
    region,
    routeSteps,
    currentStepIndex,
    selectedMarker,
    showInfoModal,
    selectedMarkerId,
    showDirections,
    followUser,
    userHeading,
  } = states;

  const {
    setMarker,
    setRegion,
    setRouteSteps,
    setCurrentStepIndex,
    setSelectedMarker,
    setSelectedMarkerId,
    setShowInfoModal,
    setShowDirections,
    setFollowUser,
    setUserHeading,
  } = setStates;

  // screen ui
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [destinationText, setDestinationText] = useState("");

  const socketRef = useRef(null);
  const markerRefs = useRef({});

  // Handle search input change and update results
  const handleSearchInputChange = async (text) => {
    setSearchText(text);

    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Use Google Places Autocomplete API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${GOOGLE_MAPS_API_KEY}&language=en&components=country:il`
      );

      const data = await response.json();

      if (data.predictions && data.predictions.length > 0) {
        // For now, just show the predictions without coordinates
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
      console.log("Error searching locations:", error);
      setSearchResults([]);
    }
  };

  const handleResultSelect = async (result) => {
    try {
      // Get place details to get coordinates
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.placeId}&key=${GOOGLE_MAPS_API_KEY}&language=en`
      );

      const detailsData = await detailsResponse.json();
      // console.log("Place Details Response:", detailsData);

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
        console.log("No geometry data in response");
      }
    } catch (error) {
      console.log("Error getting place details:", error);
      Alert.alert("Error", "Could not get location details. Please try again.");
    }
  };

  // Initialize location permissions and socket connection
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
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Send location updates to server every 5 seconds
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

      const intervalId = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          enableHighAccuracy: true,
          heading: true,
        });
        const { latitude, longitude, heading } = loc.coords;

        setUserHeading(heading);
      }, 5000);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error transmitting location:", error);
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
                <Text style={styles.distanceText}>
                  {routeSteps[currentStepIndex]?.distance?.text || ""}
                </Text>
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
                  setFollowUser(false);
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
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
  cancelButton: {
    width: "30%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    marginLeft: 10,
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
    backgroundColor: "black",
    padding: 15,
    borderRadius: 12,
    zIndex: 999,
  },
  distanceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  streetText: {
    fontSize: 18,
    color: "#00aaff",
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
    backgroundColor: "#4958FF",
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  directionsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  searchResultsContainer: {
    width: "100%",
    maxHeight: 200,
    marginTop: 10,
    marginBottom: 10,
    overflow: "scroll",
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
