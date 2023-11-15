import mongoose from 'mongoose';

export interface IUrl {
  alias: string;
  shortUrl: string;
  url: string;
  userId: string | mongoose.Types.ObjectId | object;
  customAlias: boolean;
  clicks: number;
}
