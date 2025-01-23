import React, { useState, useEffect } from 'react';
import styles from './AccommodationList.module.css';
import OverviewMap from '../../components/AccomodationList/OverviewMap/OverviewMap.jsx';
import AccoGallery from '../../components/AccomodationList/AccoGallery/AccoGallery.jsx';
import FilterAndSort from '../../components/Shared/FilterAndSort/FilterAndSort.jsx';
import { useAcco } from '../../context/AccommodationContext.jsx';
import { MapTrifold, SquaresFour } from '@phosphor-icons/react';
import Search from '../../components/Shared/Search/Search.jsx';

export default function AccomodationList() {
  const { stateFilter, getAllAccommodations, selectedView, setSelectedView } =
    useAcco();

  const handleToggleChange = (event) => {
    setSelectedView(event.target.id);
  };

  return (
    <>
      <Search />
      <div className={styles.accommodationList}>
        {!stateFilter && <h2 className={styles.h2}>All Listings</h2>}
        {stateFilter && <h2 className={styles.h2}>{stateFilter}</h2>}

        <div className={styles.controls}>
          <FilterAndSort />
          <div className={styles.switchView_container}>
            <div
              className={styles.radio_container}
              title='Gallery View'
              aria-label='Gallery View'
            >
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
            <div
              className={styles.radio_container}
              title='Map View'
              aria-label='Map View'
            >
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
