import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import io from 'socket.io-client';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const serverUrl = import.meta.env.VITE_SERVER_URL;
console.log(serverUrl);

const socket = io(serverUrl); // Connect to your server

const MyMap = () => {
  // const map = useMap();
  // const routesLibrary = useMapsLibrary('routes');

  // const [waypoints, setWaypoints] = useState([]); // Start with no waypoints
  // const [activeWaypoint, setActiveWaypoint] = useState(0); // Tracks whether setting start or end
  // const [directionsService, setDirectionsService] = useState(null);
  // const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const [userLocations, setUserLocations] = useState([]); // Store user locations
  
  useEffect(() => {
    socket.emit('register', {
      role: 'admin',  // set role as 'admin'
      userId: 'adminId123', // you can pass the actual admin ID here
      location: { lat: 0, lng: 0 } // You can set an initial location or update it later
    });
  }, []);

  // Fetch user locations from the server
  useEffect(() => {
    // Listen for 'user_list_update' event from the server
    socket.on('user_list_update', (userList) => {
      console.log('Received user list:', userList); // Logs the user locations
      setUserLocations(userList); // Update state with the new user locations
    });

    // Clean up on component unmount
    return () => {
      socket.off('user_list_update');
    };
  }, []);

  // Initialize DirectionsService and DirectionsRenderer
  // useEffect(() => {
  //   if (routesLibrary && map) {
  //     setDirectionsService(new routesLibrary.DirectionsService());
  //     const renderer = new routesLibrary.DirectionsRenderer({ map });
  //     setDirectionsRenderer(renderer);
  //   }
  // }, [routesLibrary, map]);

  // Center map on user location
  // useEffect(() => {
  //   if (map && navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const userLocation = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         map.panTo(userLocation);
  //         map.setZoom(15);
  //       },
  //       (error) => {
  //         console.error('Error getting location:', error);
  //       }
  //     );
  //   }
  // }, [map]);

  // Calculate route only when two waypoints are defined
  // useEffect(() => {
  //   if (directionsService && directionsRenderer && waypoints.length === 2) {
  //     directionsService.route(
  //       {
  //         origin: waypoints[0],
  //         destination: waypoints[1],
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       },
  //       (response, status) => {
  //         if (status === 'OK') {
  //           directionsRenderer.setDirections(response);
  //         } else {
  //           console.error('Directions request failed:', status);
  //         }
  //       }
  //     );
  //   } else if (directionsRenderer) {
  //     // Clear the route if less than 2 waypoints
  //     directionsRenderer.setDirections({ routes: [] });
  //   }
  // }, [waypoints, directionsService, directionsRenderer]);

  // Handle map clicks to define waypoints
  // const handleMapClick = (event) => {
  //   const newWaypoint = {
  //     lat: event.detail.latLng.lat,
  //     lng: event.detail.latLng.lng,
  //   };

  //   setWaypoints((prev) => {
  //     if (prev.length < 2) {
  //       return [...prev, newWaypoint];
  //     } else {
  //       // Replace the active waypoint
  //       const updated = [...prev];
  //       updated[activeWaypoint] = newWaypoint;
  //       return updated;
  //     }
  //   });

  //   // Toggle active waypoint (0 -> 1 -> 0 ...)
  //   setActiveWaypoint((prev) => (prev === 0 ? 1 : 0));
  // };

  return (
    <APIProvider apiKey={key}>
        <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        // onClick={handleMapClick}
        >
        {userLocations.map((user, index) => (
            <Marker
              key={index}
              position={{ lat: user.location.latitude, lng: user.location.longitude }}
              title={`User: ${user.id}`} // Display user ID as title
            />
        ))}
        </Map>
    </APIProvider>
  );
};

export default MyMap;
