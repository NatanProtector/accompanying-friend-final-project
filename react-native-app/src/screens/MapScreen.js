import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = () => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow location access.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("User Location:", location.coords);

      setRegion({
        latitude: location.coords.latitude || 32.0853, // Default to Tel Aviv
        longitude: location.coords.longitude || 34.7818,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getLocationPermission();
  }, []);

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


// import React from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// const MapScreen = () => {
//   const defaultRegion = {
//     latitude: 32.0853,
//     longitude: 34.7818,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} region={defaultRegion}>
//         <Marker coordinate={defaultRegion} title="Test Location" />
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, width: "100%", height: 500 },
//   map: { flex: 1, width: "100%", height: "100%" }, 
// });

// export default MapScreen;
