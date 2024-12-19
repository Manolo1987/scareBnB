import React, { useState, useEffect } from 'react';
import styles from './AccommodationList.module.css';
import OverviewMap from '../../components/AccomodationList/OverviewMap/OverviewMap.jsx';
import AccoGallery from '../../components/AccomodationList/AccoGallery/AccoGallery.jsx';
import Filter from '../../components/Shared/FilterAndSort/Filter.jsx';
import Sort from '../../components/Shared/FilterAndSort/Sort.jsx';
import { useAcco } from '../../context/AccommodationContext.jsx';
import { MapTrifold, SquaresFour } from '@phosphor-icons/react';

export default function AccomodationList() {
  const { stateFilter, getAllAccommodations } = useAcco();

  const [selectedView, setSelectedView] = useState('map-view');

  const handleToggleChange = (event) => {
    setSelectedView(event.target.id);
  };

  useEffect(() => {
    //getAllAccommodations(); // for Map
    //getAllAccommodations(21); // for AccoGallery with limit
  }, []);

  return (
    <div>
      {!stateFilter && <h1>All Accommodations</h1>}
      {stateFilter && <h1>Accommodations in {stateFilter}</h1>}

      <div className={styles.controls}>
        <Filter />
        <Sort />
        <div className={styles.switchView_container}>
          <div className={styles.radio_container}>
            <input
              type='radio'
              name='view'
              id='map-view'
              className={styles.radio}
              checked={selectedView === 'map-view'}
              onChange={handleToggleChange}
            />
            <label
              htmlFor='map-view'
              className={`${styles.icon} ${styles.mapIcon}`}
            >
              <MapTrifold size={32} className={styles.icon} />
            </label>
          </div>
          <div className={styles.radio_container}>
            <input
              type='radio'
              name='view'
              id='gallery-view'
              className={styles.radio}
              checked={selectedView === 'gallery-view'}
              onChange={handleToggleChange}
            />
            <label
              htmlFor='gallery-view'
              className={`${styles.icon} ${styles.galleryIcon}`}
            >
              <SquaresFour size={32} className={styles.icon} />
            </label>
          </div>
        </div>
      </div>
      {selectedView === 'gallery-view' && <AccoGallery />}
      {selectedView === 'map-view' && <OverviewMap />}
    </div>
  );
}
