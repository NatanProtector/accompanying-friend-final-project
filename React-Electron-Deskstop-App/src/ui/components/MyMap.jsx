import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import io from 'socket.io-client';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const serverUrl = import.meta.env.VITE_SERVER_URL;
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
    try {
      socket.emit('register', {
        role: 'admin',  // set role as 'admin'
        userId: 'adminId123', // you can pass the actual admin ID here
        location: { lat: 0, lng: 0 } // You can set an initial location or update it later
      });
    }
    catch (error) {
      ;
    }

  }, []);

  // Fetch user locations from the server
  useEffect(() => {

    try {
      // Listen for 'user_list_update' event from the server
      socket.on('user_list_update', (userList) => {
        // console.log('Received user list:', userList); // Logs the user locations
        setUserLocations(userList); // Update state with the new user locations
      });
    } catch {
      ;
    }


    // Clean up on component unmount
    return () => {
      socket.off('user_list_update');
    };
  }, []);

  return (
    <APIProvider apiKey={key}>
        <Map
        style={{ width:"100%", height: "100%" }}
        defaultCenter={{  lat: 31.95, lng: 35.2137 }}
        defaultZoom={9}
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
