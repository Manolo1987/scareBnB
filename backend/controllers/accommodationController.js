//accommodationController.js
import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';
import Booking from '../models/Booking.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinary.js';

export async function getAllAccommodations(req, res) {
  try {
    // get currentPage, Sort and Filter Options from req.query
    const {
      state,
      maxPrice,
      minPrice,
      minBedrooms,
      maxBedrooms,
      minRating,
      page = 1,
      sortBy = 'pricePerNight',
      sortOrder = 'asc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = 21;

    const filter = {};

    if (state) filter.state = state;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = minPrice;
      if (maxPrice) filter.pricePerNight.$lte = maxPrice;
    }
    if (minBedrooms || maxBedrooms) {
      filter.bedrooms = {};
      if (minBedrooms) filter.bedrooms.$gte = minBedrooms;
      if (maxBedrooms) filter.bedrooms.$lte = maxBedrooms;
    }
    if (minRating) filter.rating = { $gte: minRating };

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const allAccos = await Accommodation.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort(sort);

    const totalCount = await Accommodation.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      accommodations: allAccos,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        perPage: limitNum,
      },
    });
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
    //console.log(listing);

    const user = await User.findById(req.userId);
    const ownerId = listing.owner._id.toString();

    if (ownerId === req.userId || user.roles === 'admin') {
      //delete listing entry in user (owner)
      await User.findByIdAndUpdate(ownerId, {
        $pull: { listings: listing._id },
      });

      // delete bookings
      const bookings = listing.bookings;

      if (listing.bookings.length > 0) {
        //find all bookings with ids
        // delete bookings in users.bookings
        for (let bookingId of bookings) {
          bookingId = bookingId.toString();

          const users = await User.updateMany(
            { bookings: bookingId },
            { $pull: { bookings: bookingId } }
          );

          //delete from bookedListings
          await User.findByIdAndUpdate(ownerId, {
            $pull: { bookedListings: bookingId },
          });

          //delete bookings itself
          await Booking.findByIdAndDelete(bookingId);
        }
      }
      // delete from users favourite list
      const users = await User.updateMany(
        { favourites: listing._id },
        { $pull: { favourites: listing._id } }
      );

      // delete comments
      // find all comments with location = listingId
      const comments = await Comment.find({ location: listingId }).populate(
        'author'
      );
      if (comments.length === 0) {
        console.log('No comments found for the specified listing.');
      } else {
        // find all users (authors) from comments
        //pull them from user.comments
        const userIds = comments.map((comment) => comment.author._id);
        await User.updateMany(
          { _id: { $in: userIds } },
          {
            $pull: {
              comments: { $in: comments.map((comment) => comment._id) },
            },
          }
        );
        console.log(
          `Removed comment IDs from the 'comments' array of ${userIds.length} users.`
        );
        //delete comments itself
        const deletedComments = await Comment.deleteMany({
          location: listingId,
        });
        console.log(`${deletedComments.deletedCount} comments were deleted.`);
      }

      //delete images on cloudinary if not admin
      if (user.roles !== 'admin') {
        //find all images ids
        const imagesIds = [listing.titleImage.public_id];
        if (listing.images.length > 0) {
          for (let img of listing.images) {
            imagesIds.push(img.public_id);
          }
        }

        //delete images on cloudinary
        for (let imgId of imagesIds) {
          console.log(imgId, 'deleted');
          await cloudinary.uploader.destroy(imgId, function (error, result) {
            console.log(result);
            console.error(error);
          });
        }
        console.log('Deleted images on cloudinary.');
      } else {
        console.log('Images not deleted, because owner of listing is admin.');
      }
      //delete listing itself
      await Accommodation.findByIdAndDelete(listing._id);

      return res.status(200).json({ msg: 'Successfully deleted listing.' });
    }
    res.status(403).json({ msg: 'Unauthorized.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}
