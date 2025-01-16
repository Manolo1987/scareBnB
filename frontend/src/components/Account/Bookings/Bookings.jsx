import React, { useEffect } from 'react';
import styles from './Bookings.module.css';
import { useBooking } from '../../../context/bookingContext';
import BookingCard from '../BookingCard/BookingCard';

export default function Bookings() {
  const { myBookings, cancelBooking, getMyBookings } = useBooking();
  useEffect(() => {
    getMyBookings();
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
      <h2>Upcoming Bookings</h2>
      {upcomingBookings?.length > 0 ? (
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

      <h2>Past Bookings</h2>
      {pastBookings?.length > 0 ? (
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
