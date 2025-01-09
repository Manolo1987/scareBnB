import React, { useEffect } from 'react';
import styles from './Accommodation.module.css';
import Search from '../../components/Shared/Search/Search.jsx';
import { useAcco } from '../../context/AccommodationContext.jsx';
import AccoSlider from '../../components/Accomodation/AccoSlider/AccoSlider.jsx';
import AccoInfo from '../../components/Accomodation/AccoInfo/AccoInfo.jsx';
import AccoMap from '../../components/Accomodation/AccoMap/AccoMap.jsx';
import BookingPreview from '../../components/Accomodation/BookingPreview/BookingPreview.jsx';
import { useLocation } from 'react-router-dom';
import Comments from '../../components/Accomodation/Comments/Comments.jsx';

export default function Accommodation() {
  const location = useLocation();
  const { currentAcco, getOneAccommodation, setCurrentAcco } = useAcco();

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  useEffect(() => {
    setCurrentAcco(null); //important for marker rendering
    if (id) {
      getOneAccommodation(id);
    }
  }, [id]);

  return (
    <>
      <Search />
      {/* if currentAcco not found -> navigate to NotFound */}
      {currentAcco && (
        <>
          <h2 className={styles.acco_title} >{currentAcco?.title}</h2>
          <AccoSlider
            titleImage={currentAcco?.titleImage}
            images={currentAcco?.images}
          />
          <AccoInfo currentAcco={currentAcco} />
          {/* <AccoMap
            lat={currentAcco?.latitude}
            lon={currentAcco?.longitude}
            title={currentAcco?.title}
          /> */}
          <Comments />
          <BookingPreview />
        </>
      )}
    </>
  );
}
