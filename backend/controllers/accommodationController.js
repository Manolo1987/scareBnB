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

//createListing
export async function createListing(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('listings');
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    //console.log(user);

    const newListing = await Accommodation.create({
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
      city: req.body.city,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      pricePerNight: req.body.pricePerNight,
      bedrooms: req.body.bedrooms,
      features: req.body.features || [],
      owner: user._id,
      titleImage: {
        secure_url: 'test',
        public_id: 'test',
      },
      images: [
        {
          secure_url: 'test',
          public_id: 'test',
        },
      ],
    });
    //console.log(newListing);

    await user.updateOne({ $addToSet: { listings: newListing._id } });

    res.status(200).json(newListing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}
