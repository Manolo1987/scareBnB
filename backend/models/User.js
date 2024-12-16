// User.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// User Schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'first name must be at least 3 characters'],
      maxlength: [30, 'first name must be at most 30 characters'],
      validate: {
        validator: function (v) {
          // Allows alphanumeric characters, spaces, hyphens, dots, @, underscores, and umlauts.
          return /^[a-zA-Z0-9\s.,;:'"@_\-\u00C0-\u017F]+$/.test(v);
        },
        message: 'first name contains invalid characters!',
      },
      set: function (v) {
        // Sanitizing: Removes unwanted characters but allows valid ones
        return v.replace(/[^\w\s.,;:'"@_\-\u00C0-\u017F()]/g, '');
      },
    },

    lastName: {
      type: String,
      required: true,
      minlength: [3, 'last name must be at least 3 characters'],
      maxlength: [30, 'last name must be at most 30 characters'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"@_\-\u00C0-\u017F]+$/.test(v);
        },
        message: 'last name contains invalid characters!',
      },
      set: function (v) {
        return v.replace(/[^\w\s.,;:'"@_\-\u00C0-\u017F()]/g, '');
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Checks if the password contains at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/.test(
            v
          );
        },
        message:
          'The password must be at least 8 characters long, contain an uppercase letter, a number, and a special character!',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          // Checks if the email is valid
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Invalid email!',
      },
      set: function (v) {
        // Sanitizing: removes whitespace and converts email to lowercase
        return v.trim().toLowerCase();
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          // allow only numbers
          return /^[0-9]+$/.test(v);
        },
        message: 'Phone number must only contain numbers!',
      },
    },
    roles: { type: String, enum: ['user', 'admin'], default: 'user' },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          // date can not be in the future
          return v <= new Date();
        },
        message: 'The date of birth cannot be in the future!',
      },
    },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }],
    listings: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }],
    bookedListings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // skip hashing if password is not modified
  }
  try {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// compare password
userSchema.methods.isValidPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

// Never send the password to the frontend
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model('User', userSchema);
export default User;
