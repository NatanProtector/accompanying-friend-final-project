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

  const handleTypeChange = (event) => {
    setEventType(event.target.value);
  };

  // const handleInputChange = (event) => {
  //   setFormDescription(event.target.value);
  // };

  const handleMapClick = (event) => {
    const { lat, lng } = event.detail.latLng;
    setClickedPosition({ lat, lng });
    setCenterCoords({ lat, lng });
    setMapZoom(13);
    setShowModal(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

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

  useEffect(() => {
    try {
      socket.on("user_list_update", (userList) => {
        console.log(userList);

        setUserLocations(userList);
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    return () => {
      socket.off("user_list_update");
    };
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
    </APIProvider>
  );
};

export default MapScreen;

const style = {
  modal: {
    position: "absolute",
    top: "30%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    color: "black",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    padding: "5px",
    width: "20%",
    height: "32%",
    backgroundColor: "black",
  },
  modalContent: {
    borderRadius: "8px",
    backgroundColor: "yellow",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
};
