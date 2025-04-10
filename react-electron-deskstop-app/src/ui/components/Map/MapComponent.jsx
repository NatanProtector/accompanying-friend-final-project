import { Map, Marker } from "@vis.gl/react-google-maps";
import MapController from "./MapController";
import PropTypes from "prop-types";

const MapComponent = ({
  userLocations,
  clickedPosition,
  onMapClick,
  centerCoords,
  mapZoom,
  defaultPosition,
  defaultZoom,
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
      {centerCoords && mapZoom && (
        <MapController clickedPosition={centerCoords} zoomLevel={mapZoom} />
      )}

      {/* Users now have red circle markers */}
      {userLocations &&
        userLocations.length > 0 &&
        userLocations.map((user, index) => (
          <Marker
            key={`user-${index}`}
            position={{
              lat: user.location.latitude,
              lng: user.location.longitude,
            }}
            title={`User: ${user.id}`}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "red",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            }}
          />
        ))}

      {/* Clicked position now has a normal default marker */}
      {clickedPosition && (
        <Marker
          position={clickedPosition}
          title={"Clicked Location"}
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
  ),
  clickedPosition: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onMapClick: PropTypes.func,
  centerCoords: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  mapZoom: PropTypes.number,
  defaultPosition: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  defaultZoom: PropTypes.number,
};

export default MapComponent;
