import express from 'express';
import * as acco from '../controllers/accommodationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/jwt.js';
import uploadMW from '../middleware/uploadToCloudinary.js';

const accoRouter = express.Router();

accoRouter.get('/all', acco.getAllAccommodations);
accoRouter.get('/one/:accoId', acco.getOneAccommodation);
accoRouter.get('/my', authenticateToken, acco.getMyListings);
accoRouter.post('/', authenticateToken, uploadMW, acco.createListing);
// accoRouter.patch('/:listingId', authenticateToken, acco.updateListing);
accoRouter.delete('/:listingId', authenticateToken, acco.deleteListing);

accoRouter.post('/comment/:accoId', authenticateToken, acco.postComment);
accoRouter.delete('/comment/:commentId', authenticateToken, acco.deleteComment);

export default accoRouter;
