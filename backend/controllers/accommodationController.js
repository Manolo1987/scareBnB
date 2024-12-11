//accommodationController.js
import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';

export async function getAllAccommodations(req, res) {
  try {
    // get currentPage, Sort and Filter Options from req.params
    const allAccos = await Accommodation.find();
    res.status(200).json(allAccos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function getOneAccommodation(req, res) {
  try {
    const { accoId } = req.params;
    //console.log(accoId);
    const acco = await Accommodation.findById(accoId);
    if (!acco) {
      return res.status(404).json({ msg: 'Accommodation ID not found.' });
    }
    //console.log(acco);
    res.status(200).json(acco);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function getMyListings(req, res) {
  try {
    const userId = req.userId;
    //console.log(userId);
    const user = await User.findById(userId).populate('listings');
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    //console.log(user);

    const onlyBooked = req.query.onlyBooked;
    //console.log(onlyBooked);
    if (onlyBooked === 'true') {
      const myBookedListings = user.listings.filter(
        (listing) => listing.isBooked === true
      );
      //console.log(myBookedListings.length);
      return res.status(200).json(myBookedListings);
    }

    const myListings = user.listings;
    //console.log(myListings.length);
    res.status(200).json(myListings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}
