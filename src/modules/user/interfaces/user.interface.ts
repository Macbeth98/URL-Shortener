import mongoose from 'mongoose';
import { userSchema } from '../modelSchemas/user.model';

export interface IUser {
  _id?: string | mongoose.Types.ObjectId | object;
  username: string;
  email: string;
  displayUsername: string;
  tier: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends mongoose.InferSchemaType<typeof userSchema> {}
