import mongoose from 'mongoose';

export const urlSchema = new mongoose.Schema(
  {
    alias: {
      index: true,
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 1000
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000
    },
    url: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customAlias: {
      type: Boolean,
      default: false
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const UrlModel = mongoose.model('Url', urlSchema);
