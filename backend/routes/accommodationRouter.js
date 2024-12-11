// accommodationRouter.js
import express from 'express';
import * as acco from '../controllers/accommodationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/jwt.js';

const accoRouter = express.Router();

accoRouter.get('/all', acco.getAllAccommodations);
accoRouter.get('/one/:accoId', acco.getOneAccommodation);
accoRouter.get('/my', authenticateToken, acco.getMyListings);
//  frontend route + query: /my?onlyBooked=false or true

accoRouter.post('/', authenticateToken, acco.createListing);
// accoRouter.patch('/:listingId', authenticateToken, acco.updateListing);
// accoRouter.delete('/:listingId', authenticateToken, acco.deleteListing); // authenticated user oder admin

// - addComment/:userId/:accomodationId (JWT)
// - deleteComment/:userId/:accomodationId (JWT und/oder Admin)
// - giveFeedback/:userId/:accomodationId (JWT)

export default accoRouter;
