// bookingRouter.js
import express from 'express';
import * as booking from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/jwt.js';

const bookingRouter = express.Router();

bookingRouter.post('/createBooking', authenticateToken, booking.createBooking);
// all Bookings is in userController via populate bookings
bookingRouter.get(
  '/myBookedListings',
  authenticateToken,
  booking.getMyBookedListings
);
bookingRouter.get(
  '/oneBooking/:bookingId',
  authenticateToken,
  booking.getOneBooking
);
bookingRouter.put(
  '/cancelBooking/:bookingId',
  authenticateToken,
  booking.cancelBooking
);
bookingRouter.patch(
  '/giveFeedback/:bookingId',
  authenticateToken,
  booking.giveFeedback
);

export default bookingRouter;
