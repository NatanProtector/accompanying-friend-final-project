import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
// import {SearchLocation} from '../utils/Communication';
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import BasicScreenTemplate from "../components/screen_components/BasicScreenTemplate";
import NavigationHeader from "../components/screen_components/NavigationHeader";
import Map from "../components/map_components/Map";
import { getDistance } from "geolib";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.1.228:3001";
const idNumber = "111111111";

export default function DriveScreen() {
  // screen ui
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // map states
  const [marker, setMarker] = useState(null);
  const [destination, setDestination] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const socketRef = useRef(null);
  const markerRefs = useRef({});

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
      });
      const { latitude, longitude } = location.coords;

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

      // Start location updates every 5 seconds, without updating the region
      const intervalId = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = loc.coords;

        // Only send the location over socket, don't change map region
        if (socketRef.current) {
          socketRef.current.emit("update_location", { latitude, longitude });
        }
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
      },
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

  // Remove HTML tags from text
  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  // Convert coordinates to human-readable address
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      return `${place.street || ""} ${place.name || ""} , ${place.city || ""}`;
    } catch (error) {
      console.log("Error:", error);
      return "Unknown location";
    }
  };

  // Handle map tap to place a marker
  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const addr = await getAddressFromCoords(latitude, longitude);
    const newMarker = {
      id: "1",
      latitude,
      longitude,
      address: addr,
      name: "Destination",
      description: "Your selected destination",
    };
    setMarker(newMarker);
    setDestination({ latitude, longitude });
  };

  // Remove marker and reset route
  const handleRemoveMarker = () => {
    setMarker(null);
    setRouteSteps([]);
    setCurrentStepIndex(0);
    setSelectedMarker(null);
  };

  // Handle search button press
  const handleSearch = async () => {
    console.log("Search:", searchText);
    // const result = await SearchLocation(searchText).catch((error) => console.log(error));
    // console.log(result);
    await handleAddMarkerByAddress();
    setSearchText("");
    setModalVisible(false);
  };

  // Add marker by searching for an address
  const handleAddMarkerByAddress = async () => {
    if (!searchText.trim()) {
      console.log("Error", "Please enter an address.");
      return;
    }

    try {
      const location = await Location.geocodeAsync(searchText);
      if (location.length === 0) {
        console.log("Error", "Address not found.");
        return;
      }

      const { latitude, longitude } = location[0];
      const addr = await getAddressFromCoords(latitude, longitude);
      const newMarker = {
        id: "1",
        latitude,
        longitude,
        address: addr,
        name: "Destination",
        description: "Your selected destination",
      };
      setMarker(newMarker);
      setDestination({ latitude, longitude });
    } catch (error) {
      console.log("Error:", error, "Could not fetch location.");
    }
  };

  return (
    <BasicScreenTemplate
      HeaderComponent={<NavigationHeader />}
      FooterComponent={
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.container}>
        <Map
          address={searchText}
          setAddress={setSearchText}
          markers={marker ? [marker] : []}
          setMarkers={(newMarkers) => setMarker(newMarkers[0] || null)}
          destination={destination}
          setDestination={setDestination}
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
          stripHtml={stripHtml}
        />
      </View>

      {/* Search Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your search..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSearch}
              >
                <Text style={styles.modalButtonText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#4958FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "gray",
    marginLeft: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
