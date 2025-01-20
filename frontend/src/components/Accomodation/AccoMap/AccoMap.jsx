import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.js';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import styles from './AccoMap.module.css';
import markerIcon from '../../../assets/images/icons/map-pin-fill-Kontur_32px.png';
import markerRetinaIcon from '../../../assets/images/icons/map-pin-fill-Kontur_64px.png';
import markerShadow from '../../../assets/images/icons/map-pin-fill-Schatten_32px.png';

const MapZoomHandler = () => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const handleWheel = (e) => {
        if (e.ctrlKey && e.deltaY !== 0) {
          e.preventDefault();
          map.zoomIn();
        }
      };
      map.getContainer().addEventListener('wheel', handleWheel);
      return () => {
        map.getContainer().removeEventListener('wheel', handleWheel);
      };
    }
  }, [map]);

  return null;
};

const AccoMap = ({ lat, lon, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  const customIcon = new L.Icon({
    iconUrl: `${markerIcon}`,
    iconRetinaUrl: `${markerRetinaIcon}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: `${markerShadow}`,
    shadowSize: [32, 32],
    shadowAnchor: [16, 32],
  });

  useEffect(() => {
    if (lat && lon) {
      setIsLoading(false);
    }
  }, [lat, lon]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.map}>
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{ width: '100%', height: '400px', aspectRatio: 1 }}
        scrollWheelZoom={false}
        zoomControl={false}
        gestureHandling={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        />
        <Marker position={[lat, lon]} icon={customIcon}>
          {/* <Popup isOpen={true}>{title}</Popup> */}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AccoMap;
