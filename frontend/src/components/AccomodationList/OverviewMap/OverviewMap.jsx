import React, { useState, useEffect, useRef } from 'react';
import '../../../App.css';
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
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.js';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { regionBounds } from '../../../assets/data/regionBounds.js';
import markerIcon from '../../../assets/images/icons/map-pin-32.png';
import markerRetinaIcon from '../../../assets/images/icons/map-pin-64.png';
import { Ghost, LockKey, DoorOpen } from '@phosphor-icons/react';

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
  const [loading, setLoading] = useState(true);

  const customIcon = new L.Icon({
    iconUrl: `${markerIcon}`,
    iconRetinaUrl: `${markerRetinaIcon}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    //   shadowUrl: 'path/to/your/shadow.png',
    // shadowSize: [44, 44],
    // shadowAnchor: [16, 44]
  });
  const mapRef = useRef();

  useEffect(() => {
    getAllAccommodations();
  }, [stateFilter, maxPrice, minPrice, bedrooms, minRating, sortBy, sortOrder]);

  useEffect(() => {
    if (allAccos && allAccos.accommodations) {
      setLoading(false);
    }
  }, [allAccos]);

  const accommodations = allAccos?.accommodations || [];

  useEffect(() => {
    if (stateFilter && regionBounds[stateFilter]) {
      setStateBounds(regionBounds[stateFilter]);
    } else {
      setStateBounds(regionBounds.germany);
    }
  }, [stateFilter]);

  useEffect(() => {
    if (mapRef.current && stateBounds && stateBounds.length === 2) {
      const map = mapRef.current;
      map.flyToBounds(stateBounds, { padding: [50, 50], duration: 1 });
    }
  }, [stateBounds]);

  if (loading) {
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
        // maxBounds={[
        //   [-85.06, -180],
        //   [85.06, 180],
        // ]}
        scrollWheelZoom={false}
        gestureHandling={true}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        />
        <ZoomControl position='bottomright' />
        {/* <ChangeView /> */}
        {!loading &&
          accommodations.length > 0 &&
          accommodations.map((acco, index) => {
            if (acco.latitude && acco.longitude) {
              return (
                <Marker
                  key={index}
                  position={[acco?.latitude, acco?.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <Link
                      to={`/accommodationList/${acco.title
                        .toLowerCase()
                        .replace(/\s+/g, '-')}?id=${acco._id}`}
                      className='cardLink'
                    >
                      <div className='infoContainer'>
                        <div className='infoHeader'>
                          <h4 className='cardTitle'>{acco.title}</h4>
                          <span className='cardCity'>{acco.city}</span>
                        </div>
                      </div>
                      <div className='imgContainer col'>
                        <img
                          src={acco.titleImage.secure_url}
                          alt='location-preview'
                          className='cardImage'
                        />
                      </div>
                      <div className='infoContainer'>
                        <div className='infoBody'>
                          <span
                            className='cardRating cardRatingEnd'
                            title={`Rating: ${acco.rating.toFixed(1)} spooks`}
                          >
                            <Ghost
                              className='ghost'
                              weight='fill'
                              size={24}
                              color='white'
                            />
                            {acco.rating.toFixed(1)}
                          </span>
                          <span className='cardBedrooms'>
                            Bedrooms: {acco.bedrooms}
                          </span>
                          <span className='cardPricePerNight'>
                            Price per Night: {acco.pricePerNight} €
                          </span>
                          <span className='cardAvailability'>
                            <span>Availability: </span>
                            {acco.isBooked ? (
                              <>
                                Close <LockKey size={20} color='white' />
                              </>
                            ) : (
                              <>
                                Open <DoorOpen size={20} color='white' />
                              </>
                            )}
                          </span>
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
