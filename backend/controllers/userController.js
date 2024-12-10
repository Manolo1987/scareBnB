// userController.js

import User from '../models/User.js';
import { generateToken } from '../middleware/jwt.js';

// Register
export async function register(req, res) {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists!' });
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
      return res.status(401).json({ error: 'Check your incredentials' });
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      roles: user.roles,
    });
    res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: false, // false in development, true in production
        path: '/',
        maxAge: 60 * 60 * 1000, // 1h
      })
      .json({
        msg: 'Login successful',
        user: user, // acces to user data in frontend
        token,
      });
  } catch (error) {
    console.log(error);
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
      secure: false, // false in development, true in production
    });
    res.status(200).json({ msg: 'Logout successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
}

// User profile
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.userId); // add populate later
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log({ user }); // debugging
    res.status(200).json({ msg: 'User found', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Fehler!' });
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

    // Findet den Benutzer in der Datenbank
    const updatedUser = await User.findById(userId);

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
    await updatedUser.save();

    // send the response with the updated user
    res.status(200).json({ msg: 'User updated successfully!', updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error!' });
  }
}

// delete user
export async function deleteUser(req, res) {
  try {
    const { userId } = req;
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
    const user = await User.find(); // add populate later
    if (user.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }
    console.log({ user }); // debugging
    res.status(200).json({ msg: 'User found', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Fehler!' });
  }
}
