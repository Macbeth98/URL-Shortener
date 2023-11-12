import mongoose from 'mongoose';
import { UserTier } from '@/utils/enum.type';

export interface User {
  username: string;
  email: string;
  tier: UserTier;
  createdAt: string;
  updatedAt?: string;
}

export interface IUserDocument extends mongoose.Document, User {}
