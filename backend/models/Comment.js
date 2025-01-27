// Comment.js
import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"()!?&€$@_\+\*\-/^°\u00C0-\u017F\n\r]+$/.test(
            v
          );
        },
        message: 'title contains invalid characters!',
      },
      set: function (v) {
        return v.replace(
          /[^\w\s.,;:'"()!?&€$@_\+\*\-/^°\u00C0-\u017F\n\r]/g,
          ''
        );
      },
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\s.,;:'"()!?&€$@_\+\*\-/^°\u00C0-\u017F\n\r]+$/.test(
            v
          );
        },
        message: 'content contains invalid characters!',
      },
      set: function (v) {
        return v.replace(
          /[^\w\s.,;:'"()!?&€$@_\+\*\-/^°\u00C0-\u017F\n\r]/g,
          ''
        );
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Comment = model('Comment', commentSchema);
export default Comment;
