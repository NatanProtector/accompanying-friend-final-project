import { useMap } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import {useEffect } from "react";

const MapController = ({ clickedPosition, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (map && clickedPosition) {
      map.panTo(clickedPosition);
      map.setZoom(zoomLevel);
    }
  }, [map, clickedPosition, zoomLevel]);

  return null;
};

MapController.propTypes = {
    clickedPosition: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
    zoomLevel: PropTypes.number.isRequired,
  };
  
export default MapController;