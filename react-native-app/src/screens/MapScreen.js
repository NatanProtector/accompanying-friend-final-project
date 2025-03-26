import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import io from "socket.io-client";

const SERVER_URL = "http://10.0.2.2:3000";

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const regionRef = useRef(null); // 👈 Ref to track the latest region

  useEffect(() => {
    let locationSubscription;

    const getLocationPermissionAndConnect = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow location access.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("Initial Location:", location.coords);

      const initialRegion = {
        latitude: location.coords.latitude || 32.0853,
        longitude: location.coords.longitude || 34.7818,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(initialRegion);
      regionRef.current = initialRegion; // 👈 Set the ref too

      // Initialize socket connection
      socketRef.current = io(SERVER_URL);

      socketRef.current.emit("register", {
        role: "user",
        userId: "user_" + Date.now(),
        location: {
          lat: initialRegion.latitude,
          lng: initialRegion.longitude,
        },
      });

      // Watch user location changes
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (newLocation) => {
          console.log("Location Update:", newLocation.coords);
          const updatedRegion = {
            ...regionRef.current,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setRegion(updatedRegion);
          regionRef.current = updatedRegion; // 👈 Update the ref
        }
      );

      // Start emitting current location
      startLocationUpdates();
    };

    const startLocationUpdates = () => {
      locationIntervalRef.current = setInterval(() => {
        if (socketRef.current && regionRef.current) {
          const currentLocation = {
            lat: regionRef.current.latitude,
            lng: regionRef.current.longitude,
          };
          console.log("Emitting location:", currentLocation);
          socketRef.current.emit("update_location", currentLocation);
        }
      }, 5000);
    };

    getLocationPermissionAndConnect();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
      if (locationSubscription) locationSubscription.remove();
    };
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const updatedRegion = {
      ...regionRef.current,
      latitude,
      longitude,
    };
    setRegion(updatedRegion);
    regionRef.current = updatedRegion; // 👈 Update the ref
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          <Marker coordinate={region} title="Your Location" />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="teal" />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: 630 },
  map: { width: "100%", height: "100%" },
});

export default MapScreen;


// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";

// const MapScreen = () => {
//   const [region, setRegion] = useState(null);

//   useEffect(() => {
//     const getLocationPermission = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "You need to allow location access.");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({});
//       console.log("User Location:", location.coords);

//       setRegion({
//         latitude: location.coords.latitude || 32.0853, // Default to Tel Aviv
//         longitude: location.coords.longitude || 34.7818,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       });
//     };

//     getLocationPermission();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {region ? (
//         <MapView style={styles.map} region={region} showsUserLocation={true}>
//           <Marker coordinate={region} title="Your Location" />
//         </MapView>
//       ) : (
//         <ActivityIndicator size="large" color="teal" />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, width: "100%", height: 630 },
//   map: { width: "100%", height: "100%"},
// });

// export default MapScreen;

// // import React from "react";
// // import { View, StyleSheet } from "react-native";
// // import MapView, { Marker } from "react-native-maps";

// // const MapScreen = () => {
// //   const defaultRegion = {
// //     latitude: 32.0853,
// //     longitude: 34.7818,
// //     latitudeDelta: 0.01,
// //     longitudeDelta: 0.01,
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <MapView style={styles.map} region={defaultRegion}>
// //         <Marker coordinate={defaultRegion} title="Test Location" />
// //       </MapView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, width: "100%", height: 500 },
// //   map: { flex: 1, width: "100%", height: "100%" }, 
// // });

// // export default MapScreen;
