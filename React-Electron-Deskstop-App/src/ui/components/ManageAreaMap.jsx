import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "./Map/MapComponent";

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const defaultPosition = { lat: 31.95, lng: 35.2137 };
const defaultZoom = 9;

const ManageAreaMap = () => {
  // eslint-disable-next-line no-unused-vars
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  // eslint-disable-next-line no-unused-vars
  const [centerCoords, setCenterCoords] = useState(defaultPosition);

  return (
    <APIProvider apiKey={key}>
      <div style={styles.container}>
        <MapComponent
          style={styles.map}
          centerCoords={centerCoords}
          mapZoom={mapZoom}
          defaultPosition={defaultPosition}
          defaultZoom={defaultZoom}
        />
      </div>
    </APIProvider>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
};

export default ManageAreaMap;
