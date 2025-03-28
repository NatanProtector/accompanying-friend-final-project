import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MyMap = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');

  const [waypoints, setWaypoints] = useState([]); // Start with no waypoints
  const [activeWaypoint, setActiveWaypoint] = useState(0); // Tracks whether setting start or end
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const [userLocations, setUserLocations] = useState([]); // Store user locations
  

  // Initialize DirectionsService and DirectionsRenderer
  useEffect(() => {
    if (routesLibrary && map) {
      setDirectionsService(new routesLibrary.DirectionsService());
      const renderer = new routesLibrary.DirectionsRenderer({ map });
      setDirectionsRenderer(renderer);
    }
  }, [routesLibrary, map]);

  // Center map on user location
  useEffect(() => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.panTo(userLocation);
          map.setZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [map]);

  // Calculate route only when two waypoints are defined
  useEffect(() => {
    if (directionsService && directionsRenderer && waypoints.length === 2) {
      directionsService.route(
        {
          origin: waypoints[0],
          destination: waypoints[1],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    } else if (directionsRenderer) {
      // Clear the route if less than 2 waypoints
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [waypoints, directionsService, directionsRenderer]);

  // Handle map clicks to define waypoints
  const handleMapClick = (event) => {
    const newWaypoint = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    };

    setWaypoints((prev) => {
      if (prev.length < 2) {
        return [...prev, newWaypoint];
      } else {
        // Replace the active waypoint
        const updated = [...prev];
        updated[activeWaypoint] = newWaypoint;
        return updated;
      }
    });

    // Toggle active waypoint (0 -> 1 -> 0 ...)
    setActiveWaypoint((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <Map
      style={{ width: '100vw', height: '100vh' }}
      defaultCenter={{ lat: 22.54992, lng: 0 }}
      defaultZoom={3}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      onClick={handleMapClick}
    >
      {userLocations.map((user, index) => (
        <Marker
          key={index}
          position={{ lat: user.location.lat, lng: user.location.lng }}
          title={`User: ${user.id}`} // Display user ID as title
        />
      ))}
      {waypoints.map((point, index) => (
        <Marker key={index} position={point} />
      ))}
    </Map>
  );
};

const App = () => {
  return (
    <APIProvider apiKey={key}>
      <MyMap />
    </APIProvider>
  );
};

export default App;