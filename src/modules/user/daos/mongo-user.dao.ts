import { ClientSession } from 'mongoose';
import { OrderValueBy } from '@/constants/db.constants';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { IUserDocument } from '../interfaces/user.interface';
import { IUserDAO } from './IUserDAO';
import { UserModel } from '../modelSchemas/user.model';

export class MongoUserDAO implements IUserDAO {
  public async createUser(createData: CreateUserDto, session?: ClientSession): Promise<IUserDocument> {
    const userDocument = await new UserModel(createData).save({ session });
    return userDocument;
  }

  public async getUserByEmailOrUsername(email?: string, username?: string): Promise<IUserDocument | null> {
    const or = [];
    if (email) {
      or.push({ email: email.toLowerCase() });
    }
    if (username) {
      or.push({ username: username.toLowerCase() });
    }

    const userDocument = await UserModel.findOne({ $or: or });
    return userDocument;
  }

  public async getUser(filterBy: { email?: string; username?: string }): Promise<IUserDocument | null> {
    const userDocument = await UserModel.findOne(filterBy);
    return userDocument;
  }

  public async getAllUsers(
    filterBy: Partial<UserResponseDto>,
    skip: number,
    limit: number,
    sortBy: string,
    order: OrderValueBy
  ): Promise<IUserDocument[]> {
    const userDocuments = await UserModel.find(filterBy)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order });
    return userDocuments;
  }

  public async updateUser(
    email: string,
    updateData: Partial<Omit<CreateUserDto, 'email' | 'password'>>,
    session?: ClientSession
  ): Promise<IUserDocument | null> {
    const userDocument = await UserModel.findOneAndUpdate({ email: email.toLowerCase() }, updateData, {
      new: true,
      session
    });
    return userDocument;
  }

  public async deleteUser(email: string, session?: ClientSession): Promise<boolean> {
    const result = await UserModel.deleteOne({ email }, { session });
    return result.deletedCount === 1;
  }
}
