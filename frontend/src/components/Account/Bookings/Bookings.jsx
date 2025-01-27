import React, { useEffect, useState } from 'react';
import styles from './Bookings.module.css';
import { useBooking } from '../../../context/bookingContext';
import BookingCard from '../BookingCard/BookingCard';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function Bookings() {
  const { myBookings, cancelBooking, getMyBookings } = useBooking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getMyBookings();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const currentDate = new Date();
  const pastBookings = myBookings.filter(
    (booking) => new Date(booking.checkIn) < currentDate
  );
  const upcomingBookings = myBookings.filter(
    (booking) => new Date(booking.checkIn) >= currentDate
  );

  return (
    <section className='accountWrapper'>
      <div className='headingEffectContainer'>
        <h2 className='headingEffect'>Upcoming Bookings</h2>
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && upcomingBookings?.length > 0 ? (
        <ul className='cardList'>
          {upcomingBookings?.map((booking, index) => {
            return (
              <li key={index}>
                {booking && (
                  <BookingCard
                    booking={booking}
                    cancelBooking={cancelBooking}
                    currentDate={currentDate}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='messageContainer'>
          <p className='message'>No upcoming bookings found.</p>
        </div>
      )}
      <h3 className={styles.subHeader}>Past Bookings</h3>
      {isLoading && <LoadingSpinner />}
      {!isLoading && pastBookings?.length > 0 ? (

        <ul className='cardList'>
          {pastBookings?.map((booking, index) => {
            return (
              <li key={index}>
                {booking && (
                  <BookingCard
                    booking={booking}
                    cancelBooking={cancelBooking}
                    currentDate={currentDate}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='messageContainer'>
          <p className='message'>No past bookings found.</p>
        </div>
      )}
    </section>
  );
}
