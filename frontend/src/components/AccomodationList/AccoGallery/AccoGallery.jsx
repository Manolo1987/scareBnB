import React, { useEffect, useState, useRef } from 'react';
import styles from './AccoGallery.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAcco } from '../../../context/AccommodationContext';
import AccoCard from '../../Shared/AccoCard/AccoCard';
import PaginationPage from '../PaginationPage/PaginationPage';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

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
    sortOrder,
  } = useAcco();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 21;

  const prevFilters = useRef({
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page'), 10) || 1;
    setCurrentPage(page);
  }, [location.search, setCurrentPage]);

  useEffect(() => {
    const currentFilters = {
      stateFilter,
      maxPrice,
      minPrice,
      bedrooms,
      minRating,
      sortBy,
      sortOrder,
    };

    const filtersChanged = Object.keys(currentFilters).some(
      (key) => currentFilters[key] !== prevFilters.current[key]
    );

    if (filtersChanged) {
      setCurrentPage(1);
      navigate('?page=1');
      prevFilters.current = currentFilters;
    }
  }, [
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
    navigate,
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getAllAccommodations(limit);
      } catch (error) {
        console.error('Error loading accommodations:', error);
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      loadData();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const handlePageChange = (page) => {
    console.log('Switching to page:', page);
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  const totalPages = allAccos.pagination?.totalCount
    ? Math.ceil(allAccos.pagination.totalCount / limit)
    : 1;

  return (
    <div className={styles.accoGallery}>
      {loading ? (
        <LoadingSpinner>
          <p>Loading accommodations...</p>
        </LoadingSpinner>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.accoList}>
            {allAccos?.accommodations?.length > 0 ? (
              allAccos.accommodations.map((acco, index) => (
                <div key={acco.id || index} className={styles.accoCard}>
                  <div className={styles.accoCardWidth}>
                    <AccoCard acco={acco} />
                  </div>
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
        </>
      )}
    </div>
  );
}
