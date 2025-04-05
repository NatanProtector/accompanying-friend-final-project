import { useState } from "react";

const DriveController = () => {
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
      name: `(${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      description: "Your selected destination",
    };
    setMarker(newMarker);
    startDrive({ latitude, longitude });
  };

  // Remove marker and reset route
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

  return {
    functions: {
      getAddressFromCoords,
      handleMapPress,
      handleRemoveMarker,
      startDrive,
      cancelDrive,
    },
    states: {
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
    },
    setStates: {
      setMarker,
      setRegion,
      setRouteSteps,
      setCurrentStepIndex,
      setSelectedMarker,
      setSelectedMarkerId,
      setShowInfoModal,
      setSelectedMarker,
      setShowDirections,
      setFollowUser,
      setUserHeading,   
    },
  };
};

export default DriveController;
