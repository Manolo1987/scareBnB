import cron from 'node-cron';
import Booking from './models/Booking.js';
import Accommodation from './models/Accommodation.js';

cron.schedule('0 * * * *', async () => {
  try {
    const currentDate = new Date();
    const expiredBookings = await Booking.find({
      checkOut: { $lt: currentDate },
      isCancelled: false,
    }).populate('accommodation');

    for (const booking of expiredBookings) {
      const accommodation = booking.accommodation;
      if (accommodation.isBooked) {
        accommodation.isBooked = false;
        await accommodation.save();
      }
    }

    console.log('Expired bookings processed successfully.');
  } catch (error) {
    console.error('Error processing expired bookings:', error);
  }
});
