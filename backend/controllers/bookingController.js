// bookingController.js
import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';
import Booking from '../models/Booking.js';

// create Booking
export async function createBooking(req, res) {
  try {
    const {
      accommodationId,
      numberOfGuests,
      checkIn,
      checkOut,
      paymentMethod,
    } = req.body;

    const { userId } = req;

    const foundAccommodation = await Accommodation.findById(accommodationId);
    if (!foundAccommodation) {
      return res.status(404).json({ msg: 'Accommodation not found' });
    }
    if (foundAccommodation.isBooked === true) {
      return res.status(400).json({ msg: 'Accommodation is already booked' });
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

    // push this booking in user bookings
    await User.updateOne(
      { _id: userId },
      { $push: { bookings: newBooking._id } }
    );

    // find host and push booking in his bookedListings
    const host = await User.findById(foundAccommodation.owner);
    await User.updateOne(
      { _id: host._id },
      { $push: { bookedListings: newBooking._id } }
    );

    // push this booking in this Accommodation
    foundAccommodation.bookings.push(newBooking._id);
    // change isBooked in Accommodation
    foundAccommodation.isBooked = true;
    await foundAccommodation.save();

    res
      .status(201)
      .json({ msg: 'Booking created successfully!', newBooking: newBooking });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

// getAllBookings from user
export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ guest: req.userId })
      .populate('accommodation guest host')
      .sort({ checkIn: -1 });
    res.status(200).json({ msg: 'Bookings found', bookings: bookings });
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
    res.status(200).json({ msg: 'Bookings found', bookings: bookings });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

// get one Booking by Id

// export async function getOneBooking(req, res) {
//   try {
//     const { bookingId } = req.params;
//     const foundBooking = await Booking.findById(bookingId).populate(
//       'accommodation guest host'
//     );
//     if (!foundBooking) {
//       return res.status(404).json({ msg: 'Booking not found' });
//     }
//     res.status(200).json({ msg: 'Booking found', foundBooking });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// }

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
    if (booking.isCancelled === true) {
      return res.status(400).json({ msg: 'Booking already cancelled' });
    }
    booking.isCancelled = true;
    accommodation.isBooked = false;
    await booking.save();
    await accommodation.save();
    res
      .status(200)
      .json({ msg: 'Booking cancelled successfully', booking: booking });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

// give Feedback for a booking in the past which wasn't cancelled
export async function giveFeedback(req, res) {
  try {
    const { bookingId } = req.params;
    const { feedback } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    //check if feedback is already there
    if (booking.giveFeedback === true) {
      return res.status(400).json({ msg: 'Feedback already given' });
    }
    // Check if the user is the guest for the booking
    if (booking.guest.toString() !== req.userId) {
      return res
        .status(403)
        .json({ msg: 'Unauthorized - only the guest can give feedback' });
    }
    // Check if the booking was cancelled
    if (booking.isCancelled === true) {
      return res
        .status(400)
        .json({ msg: 'You cannot give feedback for a cancelled booking' });
    }
    // Check if feedback is between 1 and 5
    if (feedback < 1 || feedback > 5) {
      return res.status(400).json({ msg: 'Feedback must be between 1 and 5' });
    }

    const currentDate = new Date();
    // const checkOutDate = new Date(booking.checkOut);
    const checkInDate = new Date(booking.checkIn);
    if (currentDate < checkInDate) {
      return res
        .status(400)
        .json({ msg: 'You can only give feedback after the check-out date' });
    }

    booking.giveFeedback = true;
    await booking.save();

    const accommodation = await Accommodation.findById(booking.accommodation);
    if (!accommodation) {
      return res.status(404).json({ msg: 'Accommodation not found' });
    }

    // Push the feedback into the accommodation's feedback field
    accommodation.feedback.push(feedback);

    // Save the accommodation document
    await accommodation.save();
    res.status(200).json({ msg: 'Feedback given successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
