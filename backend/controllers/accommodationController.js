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

    const user = await User.findById(userId).populate('listings');
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const myListings = user.listings;

    res.status(200).json(myListings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function createListing(req, res) {
  try {
    //console.log(req.files['titleImage']);
    // console.log(req.files['otherImages']);
    //console.log(req.body);
    const userId = req.userId;
    const user = await User.findById(userId).populate('listings');

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    //console.log(user);

    const features = req.body.features.split(',');

    const titleImg = req.files['titleImage'][0];

    if (!titleImg) {
      return res.status(400).json({ msg: 'Please upload a title image.' });
    }
    const titleImage = {
      secure_url: titleImg.path,
      public_id: titleImg.filename,
    };

    //console.log(titleImg);

    const images = [];

    if (req.files['otherImages'] && req.files['otherImages'].length > 0) {
      for (let img of req.files['otherImages']) {
        images.push({
          secure_url: img.path,
          public_id: img.filename,
        });
      }
    }

    const newListing = await Accommodation.create({
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
      city: req.body.city,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      pricePerNight: req.body.pricePerNight,
      bedrooms: req.body.bedrooms,
      features: features || [],
      owner: user._id,
      titleImage: titleImage,
      images: images,
    });
    //console.log(newListing);

    await user.updateOne({ $addToSet: { listings: newListing._id } });

    res.status(200).json(newListing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

//deleteListing
export async function deleteListing(req, res) {
  try {
    const { listingId } = req.params;
    const listing = await Accommodation.findById(listingId).populate('owner');
    const user = await User.findById(req.userId);
    const ownerId = listing.owner._id.toString();

    if (ownerId === req.userId || user.roles === 'admin') {
      await User.findByIdAndUpdate(ownerId, {
        $pull: { listings: listing._id },
      });
      // delete comments
      // delete bookings
      //delete images on cloudinary if not admin
      await Accommodation.findByIdAndDelete(listing._id);

      return res.status(200).json({ msg: 'Successfully deleted listing.' });
    }
    res.status(403).json({ msg: 'Unauthorized.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}
