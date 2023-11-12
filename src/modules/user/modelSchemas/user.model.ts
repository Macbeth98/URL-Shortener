import mongoose from 'mongoose';
import { UserTier } from '@/utils/enum.type';

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50
    },
    displayUsername: {
      type: String,
      require: true,
      trim: true
    },
    tier: {
      type: String,
      enum: UserTier,
      default: UserTier.FREE
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model('User', userSchema);
