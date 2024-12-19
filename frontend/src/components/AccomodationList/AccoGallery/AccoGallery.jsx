import React, { useEffect, useState } from 'react';
import styles from './AccoGallery.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import AccoCard from '../../Shared/AccoCard/AccoCard';
import PaginationPage from '../PaginationPage/PaginationPage';

export default function AccoGallery() {
  const {
    allAccos,
    getAllAccommodations,
    currentPage,
    setCurrentPage,
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder
  } = useAcco();
  const limit = 21;

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    getAllAccommodations(limit);
  }, [currentPage, stateFilter, maxPrice, minPrice, bedrooms, minRating, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    console.log('Switching to page:', page);
    setCurrentPage(page);
  };

  const totalPages = allAccos.pagination?.totalCount
    ? Math.ceil(allAccos.pagination.totalCount / limit)
    : 1;

  return (
    <div className={styles.accoGallery}>
      <div className={styles.accoList}>
        {allAccos?.accommodations?.length > 0 ? (
          allAccos.accommodations.map((acco, index) => (
            <div key={acco.id || index} className={styles.accoCard}>
              <AccoCard acco={acco} />
            </div>
          ))
        ) : (
          <p>No accommodations found</p>
        )}
      </div>
      <PaginationPage
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
