  import { useEffect, useState } from 'react';
  import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
  import io from 'socket.io-client';

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const socket = io(serverUrl);

  const defaultPosition = { lat: 31.95, lng: 35.2137 };
  const defaultZoom = 9;


  const MapController = ({ clickedPosition, zoomLevel }) => {
    const map = useMap();
    
    // Pan to new location when clickedPosition changes
    useEffect(() => {
      if (map && clickedPosition) {
        map.panTo(clickedPosition);
        map.setZoom(zoomLevel);
      }
    }, [map, clickedPosition, zoomLevel]);
    
    return null;
  };


  const MyMap = () => {
    const [userLocations, setUserLocations] = useState([]);
    const [clickedPosition, setClickedPosition] = useState(null);
    
    // Event model
    const [showModal, setShowModal] = useState(false);
    const [formDescription, setFormDescription] = useState("");
    const [eventType, setEventType] = useState("");

    // Map states
    const [mapZoom, setMapZoom] = useState(defaultZoom);
    const [centerCoords, setCenterCoords] = useState(defaultPosition);

    const handleTypeChange = (event) => {
      setEventType(event.target.value);
    };

    const handleInputChange = (event) => {
      setFormDescription(event.target.value);
    };

    // Handle map click to add marker
    const handleMapClick = (event) => {
      const { lat, lng } = event.detail.latLng;
      setClickedPosition({ lat, lng });
      setCenterCoords({ lat, lng });
      setMapZoom(13);
      setShowModal(true);
    };

    const handleFormSubmit = (event) => {
      event.preventDefault(); // Prevent default form submission
      
      // Create an object with the form data
      const formData = {
        type: eventType,
        description: formDescription
      };
      
      // Log the form data
      console.log(formData);
      
      // Close the modal
      handleCloseModal();
    };

    const handleCloseModal = () => {
      setClickedPosition(null);
      setShowModal(false);
    };

    useEffect(() => {
      try {
        socket.emit('register', {
          role: 'admin',
          userId: 'adminId123',
          location: { lat: 0, lng: 0 }
        });
      } catch (error) {
        console.error('Socket registration error:', error);
      }
    }, []);

    useEffect(() => {
      try {
        socket.on('user_list_update', (userList) => {
          setUserLocations(userList);
        });
      } catch (error) {
        console.error('Socket connection error:', error);
      }

      return () => {
        socket.off('user_list_update');
      };
    }, []);


    return (
      <APIProvider apiKey={key}>
        
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={defaultPosition}
          defaultZoom={defaultZoom}

          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={handleMapClick}  // Added click handler
          reuseMaps={true}
        >

          <MapController clickedPosition={centerCoords} zoomLevel={mapZoom} />
        
          {userLocations.map((user, index) => (
            <Marker
              key={`user-${index}`}
              position={{ lat: user.location.latitude, lng: user.location.longitude }}
              title={`User: ${user.id}`}
            />
          ))}

          {clickedPosition && (
            <Marker
              position={clickedPosition}
              title={"Clicked Location"}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "red",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "white"
              }}
            />
          )}
        
        </Map>
        

        {showModal && (
          <div style={style.modal}>
            <form style={style.modalContent} onSubmit={handleFormSubmit}>
              {/* <div> */}
                <h3>Create Event</h3>
                <label>Type:</label>
                <select
                  name="type"
                  onChange={handleTypeChange}
                  required
                >
                  <option value="fire">Fire</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
              {/* </div> */}
              {/* <div> */}
                <label>Description:</label>
                <textarea
                  name="description"
                  // value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              {/* </div> */}
              <div>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </APIProvider>
    );
  };

  export default MyMap;

const style = {
  modal: {
    position: 'absolute',
    top: '30%',
    left: '80%',
    transform: 'translate(-50%, -50%)',
    color: 'black',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    padding: '5px',
    width: '20%',
    height: '32%',
    backgroundColor: 'black',
  },
  modalContent: {
    borderRadius: '8px',
    backgroundColor: 'yellow',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  }
}