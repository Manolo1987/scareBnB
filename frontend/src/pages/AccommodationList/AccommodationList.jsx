import React, { useState, useEffect } from 'react';
import styles from './AccommodationList.module.css';
import OverviewMap from '../../components/AccomodationList/OverviewMap/OverviewMap.jsx';
import AccoGallery from '../../components/AccomodationList/AccoGallery/AccoGallery.jsx';
import Filter from '../../components/Shared/FilterAndSort/Filter.jsx';
import Sort from '../../components/Shared/FilterAndSort/Sort.jsx';
import { useAcco } from '../../context/AccommodationContext.jsx';
import { MapTrifold, SquaresFour } from '@phosphor-icons/react';
import Search from '../../components/Shared/Search/Search.jsx';

export default function AccomodationList() {
  const { stateFilter, getAllAccommodations, selectedView, setSelectedView } =
    useAcco();

  // const [selectedView, setSelectedView] = useState('map-view');

  const handleToggleChange = (event) => {
    setSelectedView(event.target.id);
  };

  return (
    <>
      <Search />
      <div>
        {!stateFilter && <h2 className={styles.h2} >All Accommodations</h2>}
        {stateFilter && <h2 className={styles.h2} >Accommodations in {stateFilter}</h2>}

        <div className={styles.controls}>
          <div className={styles.filterAndSort}>
          <Filter />
          {selectedView === 'gallery-view' && <Sort />}
          </div>
          <div className={styles.switchView_container}>
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
          </div>
        </div>
        {selectedView === 'gallery-view' && <AccoGallery />}
        {selectedView === 'map-view' && <OverviewMap />}
      </div>
    </>
  );
}
