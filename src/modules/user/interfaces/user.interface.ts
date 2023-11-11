import mongoose from 'mongoose';
import { userSchema } from '../modelSchemas/user.model';

export type User = mongoose.InferSchemaType<typeof userSchema>;

export interface IUserDocument extends mongoose.Document, User {}
