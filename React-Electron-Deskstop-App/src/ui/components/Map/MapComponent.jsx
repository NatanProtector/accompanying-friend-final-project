import { Map, Marker } from "@vis.gl/react-google-maps";import MapController from "./MapController";
import PropTypes from "prop-types";
import React from "react";

const MapComponent = ({
  userLocations,
  clickedPosition,
  onMapClick,
  centerCoords,
  mapZoom,
  defaultPosition,
  defaultZoom
}) => {
  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultCenter={defaultPosition}
      defaultZoom={defaultZoom}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={onMapClick}
      reuseMaps={true}
    >
      <MapController clickedPosition={centerCoords} zoomLevel={mapZoom} />

      {userLocations.map((user, index) => (
        <Marker
          key={`user-${index}`}
          position={{
            lat: user.location.latitude,
            lng: user.location.longitude,
          }}
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
            strokeColor: "white",
          }}
        />
      )}
    </Map>
  );
};

MapComponent.propTypes = {
  userLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
  clickedPosition: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  onMapClick: PropTypes.func.isRequired,
  centerCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  mapZoom: PropTypes.number.isRequired,
};

export default MapComponent;
