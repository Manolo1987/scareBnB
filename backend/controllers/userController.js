// userController.js

import User from '../models/User.js';
import Accommodation from '../models/Accommodation.js';
import Booking from '../models/Booking.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinary.js';
import { generateToken } from '../middleware/jwt.js';

// Register
export async function register(req, res) {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email or Phone already exists!' });
    }

    const newUser = await User.create(req.body);
    res.status(201).json({ msg: 'User created', newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Login

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await user.isValidPassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Check your credentials' });
    }
    // Populate related data
    const fullUser = await User.findById(user._id)
      .populate('favourites')
      .populate('listings')
      .populate('bookings')
      .populate({
        path: 'bookedListings',
        populate: { path: 'accommodation' },
      });

    const token = generateToken({
      userId: fullUser._id,
      email: fullUser.email,
      roles: fullUser.roles,
    });

    res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true, // false in development, true in production
        path: '/',
        maxAge: 5 * 60 * 60 * 1000, // 1h
      })
      .json({
        msg: 'Login successful',
        user: fullUser, // access to user data in frontend
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Logout
export async function logout(req, res) {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true, // false in development, true in production
    });
    res.status(200).json({ msg: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}
// User profile
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.userId)
      .populate('favourites')
      .populate('listings')
      .populate({
        path: 'bookings',
        populate: [
          { path: 'accommodation' },
          { path: 'guest' },
          { path: 'host' },
        ],
      })
      .populate({
        path: 'bookedListings',
        populate: { path: 'accommodation' },
      });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'User found', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error!' });
  }
}

// update User Data
export async function updateUser(req, res) {
  try {
    const { userId } = req; // ID from JWT Token
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    let updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found!' });
    }

    // Loop through the update data and update the user
    for (const [key, value] of Object.entries(updateData)) {
      // only change fields that are in the request
      if (updatedUser[key] !== undefined) {
        updatedUser[key] = value;
      }
    }

    // save the updated user
    await updatedUser.save({ validateModifiedOnly: true });

    updatedUser = await User.findById(req.userId)
      .populate('favourites')
      .populate('listings')
      .populate('bookings')
      .populate({
        path: 'bookedListings',
        populate: { path: 'accommodation' },
      });

    // send the response with the updated user
    res
      .status(200)
      .json({ msg: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error!' });
  }
}

// delete user
export async function deleteUser(req, res) {
  try {
    const { userId } = req;
    // Kommentare löschen
    await Comment.deleteMany({ author: userId });

    // Buchungen löschen
    await Booking.deleteMany({ $or: [{ guest: userId }, { host: userId }] });
    // Accommodation löschen
    const listings = await Accommodation.find({ owner: userId });
    for (const listing of listings) {
      // Kommentare zur Unterkunft löschen
      await Comment.deleteMany({ location: listing._id });

      // Buchungen zur Unterkunft löschen
      await Booking.deleteMany({ accommodation: listing._id });

      // Bilder in Cloudinary löschen
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

      const users = await User.updateMany(
        { favourites: listing._id },
        { $pull: { favourites: listing._id } }
      );
    }
    await Accommodation.deleteMany({ owner: userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json({ msg: 'User deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// find all Users as admin
export async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .populate('favourites')
      .populate('listings')
      .populate({
        path: 'bookings',
        populate: [
          { path: 'accommodation' },
          { path: 'guest' },
          { path: 'host' },
        ],
      })
      .populate({
        path: 'bookedListings',
        populate: { path: 'accommodation' },
      })
      .populate({ path: 'comments', populate: { path: 'location' } })
      .sort({ firstName: 1 });
    if (users.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }

    res.status(200).json({ msg: 'Users found', users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error!' });
  }
}

// delete User as admin
export async function deleteUserByAdmin(req, res) {
  try {
    const { userId } = req.params;
    // Kommentare löschen
    await Comment.deleteMany({ author: userId });

    // Buchungen löschen
    await Booking.deleteMany({ $or: [{ guest: userId }, { host: userId }] });
    // Accommodation löschen
    const listings = await Accommodation.find({ owner: userId });
    for (const listing of listings) {
      // Kommentare zur Unterkunft löschen
      await Comment.deleteMany({ location: listing._id });

      // Buchungen zur Unterkunft löschen
      await Booking.deleteMany({ accommodation: listing._id });

      // Bilder in Cloudinary löschen
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

      const users = await User.updateMany(
        { favourites: listing._id },
        { $pull: { favourites: listing._id } }
      );
    }
    await Accommodation.deleteMany({ owner: userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      msg: `User ${deletedUser.firstName} ${deletedUser.lastName} deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// user add his favourite accomodation
export async function addFavourite(req, res) {
  try {
    const { userId } = req;
    const { accommodationId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: accommodationId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({
      msg: 'Accommodation added to favorites',
      favourites: updatedUser.favourites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// user removes accommodation from favourites
export async function removeFavourite(req, res) {
  try {
    const { userId } = req;
    const { accommodationId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: accommodationId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({
      msg: 'Accommodation removed from favorites',
      favourites: updatedUser.favourites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

export async function verifyToken(req, res) {
  res.status(200).json({ msg: 'Token ist valid!', user: req.userId }); // die Route prüft beim einloggen vorab, ob der Nutzer noch einen gültigen Token hat - die Funktion aus der Middleware muss diese Route schützen
}
