import React from 'react';
import styles from './Booking.module.css';
import { useBooking } from '../../context/bookingContext';
import { useAuth } from '../../context/UserAuthContext';

export default function Booking() {
  const { currentBooking, createBooking, bookingPreview } = useBooking();
  const { user } = useAuth();
  return (
    <section>
      <h1>
        Booking for {user.firstName} {user.lastName}
      </h1>
      <p>You'll book: {bookingPreview.accommodation}</p>
      <p>Price per Night: {bookingPreview.pricePerNight}</p>
      <p>Guests: {currentBooking.numberOfGuests}</p>
      <p>CheckIn: {currentBooking.checkIn.toISOString().split('T')[0]}</p>
      <p>CheckOut{currentBooking.checkOut.toISOString().split('T')[0]}</p>
      <p>Nights: {bookingPreview.nights}</p>
      <p>Total Price:{bookingPreview.totalPrice}</p>
      <p>payment Method: {currentBooking.paymentMethod}</p>
      <button onClick={createBooking}>Book Now</button>
    </section>
  );
}
