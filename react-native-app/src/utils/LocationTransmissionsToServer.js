import { useEffect, useRef } from "react";
import io from "socket.io-client";

const LocationTransmissionsToServer = ({
  userRole,
  userId,
  location, // Expects { latitude: number, longitude: number } | null
  serverUrl,
  updateInterval,
  isEnabled = true, // Control whether updates should be sent
}) => {
  const socketRef = useRef(null);

  // Effect for Socket Connection and Registration
  useEffect(() => {
    if (!isEnabled || !location || !userRole || !userId || !serverUrl) {
      // If not enabled or essential props are missing, ensure socket is disconnected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect only if not already connected
    if (!socketRef.current) {
      socketRef.current = io(serverUrl);

      socketRef.current.on("connect", () => {
        socketRef.current.emit("register", {
          role: userRole,
          userId: userId,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      });

      socketRef.current.on("disconnect", (reason) => {
        socketRef.current = null; // Ensure ref is cleared on disconnect
      });

      socketRef.current.on("connect_error", (error) => {
        socketRef.current = null; // Clear ref on connection error
      });
    }

    // Cleanup function to disconnect socket when component unmounts or props change causing disconnect
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // Re-run this effect if essential connection parameters change or if enabled status changes
  }, [
    isEnabled,
    userRole,
    userId,
    serverUrl,
    location?.latitude,
    location?.longitude,
  ]); // Add location dependency to ensure registration happens with initial location

  // Effect for Sending Location Updates
  useEffect(() => {
    if (
      !isEnabled ||
      !socketRef.current ||
      !socketRef.current.connected ||
      !location
    ) {
      // console.log("Skipping location update (not enabled, not connected, or no location).");
      return;
    }

    // console.log(`Setting up location update interval (${updateInterval}ms)...`);
    const intervalId = setInterval(() => {
      // console.log("Emitting location update:", location);
      socketRef.current.emit("update_location", {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }, updateInterval);

    // Cleanup function to clear the interval
    return () => {
      // console.log("Clearing location update interval.");
      clearInterval(intervalId);
    };
    // Re-run this effect if isEnabled, location, or updateInterval changes
  }, [isEnabled, location, updateInterval, socketRef.current?.connected]); // Depend on socket connection status

  // This component does not render anything
  return null;
};

export default LocationTransmissionsToServer;
