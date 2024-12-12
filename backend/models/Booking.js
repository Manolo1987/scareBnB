// Booking.js
import { model, Schema } from 'mongoose';
import Accommodation from './Accommodation.js';

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
  totalNights: { type: Number, required: true },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'paypal', 'bank transfer'],
    required: true,
  },
  totalPrice: { type: Number, required: true, min: 0 },
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
