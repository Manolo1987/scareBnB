//accommodationController.js
import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';
import Booking from '../models/Booking.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

export async function getAllAccommodations(req, res) {
  try {
    // get currentPage, Sort and Filter Options from req.query
    const {
      state,
      maxPrice,
      minPrice,
      bedrooms,
      minRating,
      page = 1,
      limit,
      sortBy = 'pricePerNight',
      sortOrder = 'asc',
    } = req.query;

    const filter = {};

    if (state) filter.state = state;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = minPrice;
      if (maxPrice) filter.pricePerNight.$lte = maxPrice;
    }
    if (bedrooms) {
      filter.bedrooms = bedrooms;
    }
    if (minRating) filter.rating = { $gte: minRating };

    if (!limit) {
      const allAccos = await Accommodation.find(filter).populate('owner');
      return res.status(200).json({
        accommodations: allAccos,
      });
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const allAccos = await Accommodation.find(filter)
      .populate('owner')
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
    console.error(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function getSpecial(req, res) {
  try {
    // owner Ids
    const ownerIds = [
      '675ff2cfae1af798eba7cc9e', // Andreas Zwiebelhuber
      '675ffef5d6e5dd8ec58f9d2e', // Danny (Dr. Acula)
      '677e4cb25dcf46aa42037435', // Manuel
      '679209ed8f892529f7764dde', // Jana (Frank Enstein)
      '67920cdec87e847cc0b72286', // Kenneth (Grim Reaper)
    ];

    // change strings to objectIds
    const objectIds = ownerIds.map(mongoose.Types.ObjectId.createFromHexString);

    const specialAccos = await Accommodation.aggregate([
      {
        $match: {
          owner: { $in: objectIds },
        },
      },
      { $sample: { size: 4 } }, // 4 random accos
    ]);

    if (specialAccos.length === 0) {
      return res.status(404).json({ msg: 'No accommodations found.' });
    }
    return res.status(200).json(specialAccos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function getOneAccommodation(req, res) {
  try {
    const { accoId } = req.params;
    //console.log(accoId);
    const acco = await Accommodation.findById(accoId)
      .populate({
        path: 'comments',
        populate: { path: 'author' },
      })
      .populate('owner');
    if (!acco) {
      return res.status(404).json({ msg: 'Accommodation ID not found.' });
    }
    //console.log(acco);
    res.status(200).json(acco);
  } catch (error) {
    console.error(error);
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

    let myListings = user.listings;

    myListings = myListings.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(myListings);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

//updateListing
export async function updateListing(req, res) {
  try {
    const { listingId } = req.params;
    const userId = req.userId;

    const listing = await Accommodation.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found.' });
    }

    const user = await User.findById(req.userId);
    const ownerId = listing.owner._id.toString();

    if (ownerId !== userId || !user) {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to update this listing.' });
    }

    const updatedFields = {};

    const {
      title,
      description,
      state,
      city,
      latitude,
      longitude,
      pricePerNight,
      bedrooms,
      features,
    } = req.body;

    if (title && title !== listing.title) updatedFields.title = title;
    if (description && description !== listing.description)
      updatedFields.description = description;
    if (state && state !== listing.state) updatedFields.state = state;
    if (city && city !== listing.city) updatedFields.city = city;
    if (latitude && latitude !== listing.latitude)
      updatedFields.latitude = latitude;
    if (longitude && longitude !== listing.longitude)
      updatedFields.longitude = longitude;
    if (pricePerNight && pricePerNight !== listing.pricePerNight)
      updatedFields.pricePerNight = pricePerNight;
    if (bedrooms && bedrooms !== listing.bedrooms)
      updatedFields.bedrooms = bedrooms;
    if (features && features !== listing.features)
      updatedFields.features = features.split(',');

    //delete old images if user not admin
    const { imagesToDelete } = req.query;
    //console.log(imagesToDelete);
    const imagesToDeleteArr =
      imagesToDelete.length > 0 ? imagesToDelete.split(',') : [];

    //console.log('imagesToDelete', imagesToDeleteArr);

    if (imagesToDeleteArr.length > 0) {
      if (user.roles !== 'admin') {
        for (let img of imagesToDeleteArr) {
          await cloudinary.uploader.destroy(img, function (error, result) {
            console.log(result);
            console.error(error);
          });
        }
      }
    }

    const existingImages =
      listing.images.filter(
        (image) => !imagesToDeleteArr.includes(image.public_id)
      ) || []; //exclude deleted images
    //console.log('existing', existingImages);
    updatedFields.images = [...existingImages];

    if (req.files) {
      if (req.files['titleImage']) {
        //console.log('titleImage', req.files['titleImage']);
        if (user.roles !== 'admin') {
          const titleImgId = listing.titleImage.public_id;
          await cloudinary.uploader.destroy(
            titleImgId,
            function (error, result) {
              console.log(result);
              console.error(error);
            }
          );
        }
        const titleImg = req.files['titleImage'][0];
        updatedFields.titleImage = {
          secure_url: titleImg.path,
          public_id: titleImg.filename,
        };
      }

      if (req.files['otherImages']) {
        //console.log('otherImages', req.files['otherImages']);

        const newImages = req.files['otherImages'].map((img) => ({
          secure_url: img.path,
          public_id: img.filename,
        }));
        //console.log('new', newImages);
        updatedFields.images = [...existingImages, ...newImages];
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      const updatedListing = await Accommodation.findByIdAndUpdate(
        listingId,
        updatedFields,
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedListing);
    } else {
      res.status(400).json({ msg: 'No fields to update.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error, please try again later.' });
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

// Comment Controllers:

export async function postComment(req, res) {
  try {
    const userId = req.userId;
    const { accoId } = req.params;
    const { title, content } = req.body;

    const acco = await Accommodation.findById(accoId);
    if (!acco) {
      return res.status(404).json({ msg: 'Accommodation not found.' });
    }

    const newComment = await Comment.create({
      author: userId,
      location: accoId,
      title,
      content,
    });

    acco.comments.push(newComment._id);
    await acco.save();

    const populatedAccom = await Accommodation.findById(accoId).populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    });

    await User.updateOne(
      { _id: userId },
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(200).json(populatedAccom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (comment.author.toString() !== userId && user.roles !== 'admin') {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: commentId });

    const accommodation = await Accommodation.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (!accommodation) {
      return res
        .status(404)
        .json({ msg: 'Accommodation not found or comment not associated' });
    }

    const userUpdate = await User.findByIdAndUpdate(
      comment.author,
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}
