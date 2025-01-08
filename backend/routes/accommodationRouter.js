import express from 'express';
import * as acco from '../controllers/accommodationController.js';
import { authenticateToken } from '../middleware/jwt.js';
import uploadMW from '../middleware/uploadToCloudinary.js';

const accoRouter = express.Router();

accoRouter.get('/all', acco.getAllAccommodations);
accoRouter.get('/special', acco.getSpecial);
accoRouter.get('/one/:accoId', acco.getOneAccommodation);
accoRouter.get('/my', authenticateToken, acco.getMyListings);
accoRouter.post('/', authenticateToken, uploadMW, acco.createListing);
accoRouter.patch(
  '/:listingId',
  authenticateToken,
  uploadMW,
  acco.updateListing
);
accoRouter.delete('/:listingId', authenticateToken, acco.deleteListing);

accoRouter.post('/comment/:accoId', authenticateToken, acco.postComment);
accoRouter.delete('/comment/:commentId', authenticateToken, acco.deleteComment);

export default accoRouter;
