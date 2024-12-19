import React, { useState, useEffect } from 'react';
import styles from './OverviewMap.module.css';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {
  MapContainer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
  TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { regionBounds } from '../../../assets/data/regionBounds.js';

export default function OverviewMap() {
  const {
    getAllAccommodations,
    allAccos,
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
  } = useAcco();

  const [stateBounds, setStateBounds] = useState(regionBounds.germany);

  useEffect(() => {
    getAllAccommodations();
  }, [stateFilter, maxPrice, minPrice, bedrooms, minRating, sortBy, sortOrder]);

  const accommodations = allAccos?.accommodations || [];

  useEffect(() => {
    if (stateFilter && regionBounds[stateFilter]) {
      setStateBounds(regionBounds[stateFilter]);
    } else {
      setStateBounds(regionBounds.germany);
    }
  }, [stateFilter]);

  if (accommodations.length === 0) {
    return <div>Loading accommodations...</div>; //loader
  }

  return (
    <div className={styles.map_outerContainer}>
      <MapContainer
        className={styles.overviewMap}
        center={[51.1657, 10.4515]}
        bounds={stateBounds}
        zoom={6}
        zoomControl={false}
        minZoom={3}
        maxZoom={16}
        maxBounds={[
          [-85.06, -180],
          [85.06, 180],
        ]}
        scrollWheelZoom={false}
        // whenCreated={(map) => {
        //   map.flyToBounds(bounds);
        // }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        />
        <ZoomControl position='bottomright' />
        {/* <ChangeView /> */}
        {accommodations.map((acco, index) => {
          if (acco.latitude && acco.longitude) {
            return (
              <Marker key={index} position={[acco.latitude, acco.longitude]}>
                <Popup>
                  <Link to={`/accommodation`} className={styles.cardLink}>
                    <div className={styles.accoCardContainer}>
                      <div className={styles.info_container}>
                        <h4>{acco.title}</h4>
                        <span>{acco.city}</span>
                      </div>
                      <div className={styles.img_container}>
                        <img
                          src={acco.titleImage.secure_url}
                          alt='location-preview'
                        />
                      </div>
                      <div className={styles.info_container}>
                        <p className={styles.rating}>🕸️ {acco.rating}</p>
                        <p>Bedrooms: {acco.bedrooms} </p>
                        <p>Price per Night: {acco.pricePerNight}€</p>
                        <p>
                          Availability: {acco.isBooked ? 'Close 🔒' : 'Open 🚪'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
}
