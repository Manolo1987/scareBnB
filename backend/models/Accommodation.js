// Accommodation.js
import { model, Schema } from 'mongoose';

const accommodationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [50, 'title must be at most 50 characters'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"@_\-\u00C0-\u017F()]+$/.test(v);
        },
        message: 'title contains invalid characters!',
      },
      set: function (v) {
        return v.replace(/[^\w\s.,;:'"@_\-\u00C0-\u017F()]/g, '');
      },
    },
    city: {
      type: String,
      required: true,
      maxlength: [50, 'city must be at most 50 characters'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"@_\-\u00C0-\u017F()]+$/.test(v);
        },
        message: 'city contains invalid characters!',
      },
      set: function (v) {
        return v.replace(/[^\w\s.,;:'"@_\-\u00C0-\u017F()]/g, '');
      },
    },
    state: {
      type: String,
      required: true,
      enum: [
        'Baden-Württemberg',
        'Bavaria',
        'Berlin',
        'Brandenburg',
        'Bremen',
        'Hamburg',
        'Hesse',
        'Lower Saxony',
        'Mecklenburg-Western Pomerania',
        'North Rhine-Westphalia',
        'Rhineland-Palatinate',
        'Saarland',
        'Saxony',
        'Saxony-Anhalt',
        'Schleswig-Holstein',
        'Thuringia',
      ],
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: {
      type: String,
      required: true,
      maxlength: [5000, 'description must be at most 5000 characters'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"()!?&_\-\u00C0-\u017F\n\r]+$/.test(v);
        },
        message: 'description contains invalid characters!',
      },
      set: function (v) {
        return v.replace(/[^\w\s.,;:'"()!?&_\-\u00C0-\u017F\n\r]/g, '');
      },
    },
    pricePerNight: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 1 },
    features: [
      {
        type: String,
        enum: [
          'Phantom WiFi',
          'Bottomless Pool',
          'Cursed Parking',
          'Ectoplasm Gym',
          'Ghost-Friendly',
          'Seance Room',
          'Creaky Floorboards',
          'Haunted Library',
          'Eternal Fireplace',
          'Poltergeist Butler Service',
          'Whispering Walls',
          'Mystic Fog Generator',
          'Time-Lost Clock',
          'Wailing Wind Ventilation',
          'Portal Closet',
        ],
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isBooked: { type: Boolean, required: true, default: false },
    feedback: [{ type: Number, min: 1, max: 5, default: [] }],
    rating: { type: Number, default: 0 },
    titleImage: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    images: {
      type: [
        {
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      validate: [
        (val) => val.length <= 4,
        '{PATH} exceeds the limit of 4 images',
      ],
    },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }], // who has booked this accommodation
  },
  {
    timestamps: true,
  }
);

// calculate rating before saving
accommodationSchema.pre('save', function (next) {
  if (this.feedback.length > 0) {
    const total = this.feedback.reduce((sum, value) => sum + value, 0);
    this.rating = (total / this.feedback.length).toFixed(1);
  } else {
    this.rating = 0;
  }
  next();
});

const Accommodation = model('Accommodation', accommodationSchema);
export default Accommodation;
