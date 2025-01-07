import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './AccoMap.module.css';

const AccoMap = ({ lat, lon, title }) => {
  const [isLoading, setIsLoading] = useState(true);

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
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        />
        <Marker position={[lat, lon]}>
          <Popup isOpen={true}>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AccoMap;
