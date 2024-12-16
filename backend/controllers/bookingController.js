// bookingController.js
import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';
import Booking from '../models/Booking.js';

// create Booking
export async function createBooking(req, res) {
  try {
    const {
      accommodationId,
      guest,
      numberOfGuests,
      checkIn,
      checkOut,
      paymentMethod,
    } = req.body;

    const foundAccommodation = await Accommodation.findById(accommodationId);
    if (!foundAccommodation) {
      return res.status(404).json({ msg: 'Accommodation not found' });
    }

    const newBooking = new Booking({
      accommodation: foundAccommodation._id,
      guest: req.userId,
      numberOfGuests,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      paymentMethod,
    });

    await newBooking.save();

    // push this booking in this Accommodation
    foundAccommodation.bookings.push(newBooking._id);
    // change isBooked in Accommodation
    foundAccommodation.isBooked = true;
    await foundAccommodation.save();

    res.status(201).json({ msg: 'Booking created successfully!', newBooking });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

//getAllBookings
/* 
this function is included in the userController. User bookings are available there via populate Methode
- userController.js
*/

// getMyBookedListings
/* 
the host should be able to see who has booked his Accommodation
*/

export async function getMyBookedListings(req, res) {
  try {
    const bookings = await Booking.find({ host: req.userId })
      .populate('accommodation guest')
      .sort({ checkIn: -1 });
    res.status(200).json({ msg: 'Bookings found', bookings });
  } catch (error) {}
}

// get one Booking by Id

export async function getOneBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const foundBooking = await Booking.findById(bookingId).populate(
      'accommodation guest host'
    );
    if (!foundBooking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(200).json({ msg: 'Booking found', foundBooking });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

// cancel a booking
export async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    const accommodation = await Accommodation.findById(booking.accommodation);
    if (!accommodation) {
      return res.status(404).json({ msg: 'Accommodation not found' });
    }
    if (booking.guest.toString() !== req.userId) {
      return res
        .status(403)
        .json({ msg: 'Unauthorized - only the guest can cancel the booking' });
    }
    booking.isCancelled = true;
    accommodation.isBooked = false;
    await booking.save();
    await accommodation.save();
    res.status(200).json({ msg: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
