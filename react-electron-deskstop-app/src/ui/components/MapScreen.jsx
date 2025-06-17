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

    try {
      const result = await ReportEmergency(eventType, clickedPosition);
      console.log("Event reported successfully:", result);

      // Show success feedback (you can replace this with a proper notification)
      alert("Event reported successfully!");

      handleCloseModal();
    } catch (error) {
      console.error("Error reporting event:", error);

      // Show error feedback
      alert(`Failed to report event: ${error.message}`);
    }
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
            <h3 style={style.modalTitle}>Create Event</h3>
            <div style={style.formGroup}>
              <label style={style.label}>Event Type:</label>
              <select
                name="type"
                onChange={handleTypeChange}
                required
                style={style.select}
              >
                <option value="">Select event type...</option>
                <option value="Shooting">Shooting</option>
                <option value="Riot">Riot</option>
                <option value="Rock throwing">Rock throwing</option>
                <option value="Vehicle theft">Vehicle theft</option>
                <option value="Molotov">Molotov</option>
              </select>
            </div>
            <div style={style.buttonContainer}>
              <button type="submit" style={style.submitButton}>
                Submit
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                style={style.cancelButton}
              >
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
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    zIndex: 1000,
    width: "25%",
    minWidth: "300px",
    backgroundColor: "black",
    padding: "2px",
  },
  modalContent: {
    borderRadius: "10px",
    backgroundColor: "#FFD700",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "24px",
    boxSizing: "border-box",
  },
  modalTitle: {
    margin: "0 0 24px 0",
    color: "#333",
    fontSize: "1.75em",
    fontWeight: "600",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "1em",
    fontWeight: "500",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "1em",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    color: "#333",
    cursor: "pointer",
    outline: "none",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "auto",
  },
  submitButton: {
    padding: "10px 24px",
    backgroundColor: "#000000",
    color: "#FFD700",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "500",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  cancelButton: {
    padding: "10px 24px",
    backgroundColor: "#333333",
    color: "#FFD700",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "500",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  eventDetails: {
    width: "100%",
    textAlign: "left",
    marginBottom: "20px",
    color: "#333",
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
