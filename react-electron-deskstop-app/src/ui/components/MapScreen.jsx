import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ReportEmergency } from "../../utils/communication";
import io from "socket.io-client";

import MapComponent from "./Map/MapComponent";

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(serverUrl);

const defaultPosition = { lat: 31.95, lng: 35.2137 };
const defaultZoom = 9;

const MapScreen = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [formDescription, setFormDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const [centerCoords, setCenterCoords] = useState(defaultPosition);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const handleTypeChange = (event) => {
    setEventType(event.target.value);
  };

  const handleMapClick = (event) => {
    const { lat, lng } = event.detail.latLng;
    setClickedPosition({ lat, lng });
    setCenterCoords({ lat, lng });
    setMapZoom(13);
    setShowEventModal(false);
    setShowModal(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      type: eventType,
      description: formDescription,
    };

    await ReportEmergency(eventType, clickedPosition);

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setClickedPosition(null);
    setCenterCoords(defaultPosition);
    setMapZoom(defaultZoom);
    setShowModal(false);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    handleCloseModal();
    setShowEventModal(true);
    // Center map on the event location
    setCenterCoords({
      lat: event.location.coordinates[1],
      lng: event.location.coordinates[0],
    });
    setMapZoom(13);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
    setShowEventModal(false);
    // Return to default position
    setCenterCoords(defaultPosition);
    setMapZoom(defaultZoom);
  };

  useEffect(() => {
    try {
      socket.emit("register", {
        role: "admin",
        userId: "adminId123",
        location: { lat: 0, lng: 0 },
      });
    } catch (error) {
      console.error("Socket registration error:", error);
    }
  }, []);

  const fetchEvents = async () => {
    const response = await fetch(`${serverUrl}/api/events`);
    const data = await response.json();
    setEvents(data);
  };

  useEffect(() => {
    try {
      socket.on("user_list_update", (userList) => {
        setUserLocations(userList);
      });

      // Listen for new event notifications
      socket.on("new_event_reported", async () => {
        fetchEvents();
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    return () => {
      socket.off("user_list_update");
      socket.off("new_event_reported");
    };
  }, []);

  useEffect(() => {
    // Get all events
    fetchEvents();

    // Set up periodic fetch every minute
    const intervalId = setInterval(fetchEvents, 60000); // 60000ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <APIProvider apiKey={key}>
      <MapComponent
        style={{ width: "80%", height: "100%" }}
        userLocations={userLocations}
        clickedPosition={clickedPosition}
        onMapClick={handleMapClick}
        centerCoords={centerCoords}
        mapZoom={mapZoom}
        defaultPosition={defaultPosition}
        defaultZoom={defaultZoom}
        events={events}
        onEventClick={handleEventClick}
      />

      {showModal && (
        <div style={style.modal}>
          <form style={style.modalContent} onSubmit={handleFormSubmit}>
            <h3>Create Event</h3>
            <label>Type:</label>
            <select name="type" onChange={handleTypeChange} required>
              <option value="Shooting">Shooting</option>
              <option value="Riot">Riot</option>
              <option value="Rock throwing">Rock throwing</option>
              <option value="Vehicle theft">Vehicle theft</option>
              <option value="Molotov">Molotov</option>
            </select>
            {/* <label>Description:</label>
            <textarea
              name="description"
              onChange={handleInputChange}
              required
            /> */}
            <div>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEventModal && selectedEvent && (
        <div style={style.modal}>
          <div style={style.modalContent}>
            <h3 style={style.modalTitle}>Event Details</h3>
            <div style={style.eventDetails}>
              <p>
                <strong>Type:</strong> {selectedEvent.eventType}
              </p>
              <p>
                <strong>Status:</strong> {selectedEvent.status}
              </p>
              <p>
                <strong>Reported By:</strong> {selectedEvent.reportedBy}
              </p>
              <p>
                <strong>Instructions:</strong> {selectedEvent.instructions}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(selectedEvent.timestamp).toLocaleString()}
              </p>
            </div>
            <div style={style.buttonContainer}>
              <button style={style.button} onClick={handleCloseEventModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </APIProvider>
  );
};

export default MapScreen;

const style = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "15%",
    transform: "translate(-50%, -50%)",
    color: "black",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    padding: "5px",
    width: "25%",
    height: "auto",
    minHeight: "32%",
    backgroundColor: "black",
  },
  modalContent: {
    borderRadius: "8px",
    backgroundColor: "#FFD700",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  modalTitle: {
    margin: "0 0 20px 0",
    color: "#333",
    fontSize: "1.5em",
  },
  eventDetails: {
    width: "100%",
    textAlign: "left",
    marginBottom: "20px",
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
  },
  button: {
    padding: "8px 20px",
    backgroundColor: "#000000",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1em",
    transition: "background-color 0.2s",
  },
};
