// Booking.js
import { model, Schema } from 'mongoose';
import Accommodation from '../models/Accommodation.js';
import { giveFeedback } from '../controllers/bookingController.js';

const bookingSchema = new Schema({
  accommodation: {
    type: Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  numberOfGuests: { type: Number, required: true, min: 1, max: 10 },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalNights: { type: Number, min: 1 },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'banktransfer'],
    required: true,
  },
  giveFeedback: { type: Boolean, default: false },
  totalPrice: { type: Number, min: 0 },
  isCancelled: { type: Boolean, default: false },
});

//calculatetotalnights,  totalprice and find host
bookingSchema.pre('save', async function (next) {
  try {
    const numberOfNights = Math.ceil(
      (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24)
    );

    if (numberOfNights <= 0) {
      return next(new Error('End date must be after start date.'));
    }

    // load accommodation and host
    const accommodation = await Accommodation.findById(
      this.accommodation
    ).populate('owner');

    if (!accommodation) {
      return next(new Error('Accommodation not found.'));
    }

    // set totalprice, totalnights and host
    this.totalNights = numberOfNights;
    this.totalPrice = accommodation.pricePerNight * numberOfNights;
    this.host = accommodation.owner;

    next();
  } catch (error) {
    next(error);
  }
});

const Booking = model('Booking', bookingSchema);
export default Booking;
