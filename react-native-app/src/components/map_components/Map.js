import React, { useEffect, useRef, useState } from "react";
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
import MapView, { Marker, Polygon } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { getDistance } from "geolib";
import redMarker from "../../../assets/markers/map-marker-svgrepo-com (1).png";
import greenMarker from "../../../assets/markers/map-marker-svgrepo-com.png";
import eventMarker from "../../../assets/markers/warning-svgrepo-com.png";
import { abcZones } from '../../../assets/A_B Zones';
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY, SERVER_URL } from "@env";
import DriverDirections from "../general_components/DriverDirections";

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
  onMapReady,
}) => {
  const mapRef = useRef(null);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [nearbyZones, setNearbyZones] = useState([]);


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
      fetchNearbyEvents(newRegion.latitude, newRegion.longitude);
    };

    getLocationPermission();
  }, []);

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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        pitch: followUser ? 45 : 0,
        duration: 1000,
      });
    }
  }, [followUser]);

  const fetchNearbyEvents = async (lat, lng) => {
    try {
      const res = await fetch(
        `${SERVER_URL}/api/events/nearby?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();
      setNearbyEvents(data);
    } catch (err) {
      console.error("Failed to fetch nearby events", err);
    }
  };

  const filterNearbyZones = (lat, lng) => {
    const filtered = abcZones.filter((zone) => {
      if (!zone.coordinates || zone.coordinates.length === 0) return false;

      const center = zone.coordinates[Math.floor(zone.coordinates.length / 2)];
      const dist = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: center.latitude, longitude: center.longitude }
      );
      return dist <= 1000000; // 10 km
    });

    setNearbyZones(filtered);
  };



  const getZoneColor = (type) => {
    return type === 'A'
      ? 'rgba(255, 0, 0, 0.78)'       // Red
      : 'rgba(55, 0, 255, 0.88)';    // Yellow
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
          onMapReady={onMapReady}
          onUserLocationChange={(event) => {
            const { coordinate } = event.nativeEvent;

            const newRegion = {
              ...region,
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            };

            setRegion(newRegion);
            fetchNearbyEvents(coordinate.latitude, coordinate.longitude);
            filterNearbyZones(coordinate.latitude, coordinate.longitude);

            if (followUser && mapRef.current) {
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
          }}

        >
      {destination && (
        <MapViewDirections
          origin={region}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="blue"
          onReady={(result) => {
            const steps = result.legs[0].steps;
            setRouteSteps(steps);
            setCurrentStepIndex(0);
          }}
        />
      )}

      
      {markers
  .filter(
    (marker) =>
      typeof marker.latitude === "number" &&
      typeof marker.longitude === "number"
  ).map((marker) => (
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

      {nearbyEvents.map((event) => (
        <Marker
          key={`event-${event._id}`}
          coordinate={{
            latitude: event.location.coordinates[1],
            longitude: event.location.coordinates[0],
          }}
          image={eventMarker} // 👈 this makes it a custom icon
          title={`Event: ${event.eventType}`}
          description={`Status: ${event.status}`}
        />
      ))}
      {nearbyZones.map((zone, index) => (
        <Polygon
          key={`zone-${index}`}
          coordinates={zone.coordinates}
          strokeColor= "black"
          fillColor={getZoneColor(zone.zone)}
          strokeWidth={2}
        />
      ))}
    </MapView>
  ) : (
    <ActivityIndicator size="large" color="teal" />
  )
}

{
  selectedMarker && (
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
        onPress={() => handleRemoveMarker(selectedMarker?.id)}
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
  )
}

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
    </View >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: 630 },
  map: { flex: 1, width: "100%", height: "100%" },
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
