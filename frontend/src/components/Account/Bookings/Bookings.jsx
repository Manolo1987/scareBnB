import React, { useEffect } from 'react';
import styles from './Bookings.module.css';
import { useBooking } from '../../../context/bookingContext';
import BookingCard from '../BookingCard/BookingCard';

export default function Bookings() {
  const { myBookings, cancelBooking, getMyBookings } = useBooking();
  useEffect(() => {
    getMyBookings();
  }, [myBookings]);

  const currentDate = new Date();

  // Buchungen aufteilen
  const pastBookings = myBookings.filter(
    (booking) => new Date(booking.checkIn) < currentDate
  );
  const upcomingBookings = myBookings.filter(
    (booking) => new Date(booking.checkIn) >= currentDate
  );

  // Render-Funktion für Buchungen
  const renderBooking = (booking) => {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    return (
      <BookingCard
        key={booking._id}
        booking={booking}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        cancelBooking={cancelBooking}
        currentDate={currentDate}
      />
    );
  };

  return (
    <section className={styles.bookings}>
      {/* Zukünftige Buchungen */}
      <h2>Upcoming Bookings</h2>
      {upcomingBookings.length > 0 ? (
        upcomingBookings.map(renderBooking)
      ) : (
        <p>No upcoming bookings found.</p>
      )}

      {/* Vergangene Buchungen */}
      <h2>Past Bookings</h2>
      {pastBookings.length > 0 ? (
        pastBookings.map(renderBooking)
      ) : (
        <p>No past bookings found.</p>
      )}
    </section>
  );
}
