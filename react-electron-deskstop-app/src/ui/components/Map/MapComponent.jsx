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
  events,
  onEventClick,
}) => {
  // Check if Google Maps API is available
  const isGoogleMapsLoaded =
    window.google && window.google.maps && window.google.maps.SymbolPath;
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

      {/* Event markers */}
      {events &&
        events.length > 0 &&
        events.map((event, index) => {
          if (event.location?.coordinates && isGoogleMapsLoaded) {
            return (
              <Marker
                key={`event-${index}`}
                position={{
                  lat: event.location.coordinates[1],
                  lng: event.location.coordinates[0],
                }}
                title={`Event: ${event.eventType}`}
                onClick={() => onEventClick(event)}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "red",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
                }}
              />
            );
          }
        })}

      {/* Users now have red circle markers */}
      {userLocations &&
        userLocations.length > 0 &&
        userLocations.map((user, index) => {
          // Check if location data exists
          if (
            user.location?.latitude &&
            user.location?.longitude &&
            isGoogleMapsLoaded
          ) {
            return (
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
                  fillColor: user.role === "citizen" ? "green" : "blue",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
                }}
              />
            );
          }
        })}

      {/* Clicked position now has a normal default marker */}
      {clickedPosition && (
        <Marker position={clickedPosition} title={"Clicked Location"} />
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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      reportedBy: PropTypes.string.isRequired,
      instructions: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      location: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
      }).isRequired,
    })
  ),
  onEventClick: PropTypes.func.isRequired,
};

export default MapComponent;
