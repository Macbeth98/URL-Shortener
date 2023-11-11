import { OrderValueBy } from '@/constants/db.constants';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { IUserDocument } from '../interfaces/user.interface';
import { IUserDAO } from './IUserDAO';
import { UserModel } from '../modelSchemas/user.model';

export class MongoUserDAO implements IUserDAO {
  async createUser(createData: CreateUserDto): Promise<IUserDocument> {
    const userDocument = await new UserModel(createData).save();
    return userDocument;
  }

  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    const userDocument = await UserModel.findOne({ email });
    return userDocument;
  }

  async getUser(filterBy: { email?: string; username?: string }): Promise<IUserDocument | null> {
    const userDocument = await UserModel.findOne(filterBy);
    return userDocument;
  }

  async getAllUsers(
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

  async updateUser(
    email: string,
    updateData: Partial<Omit<CreateUserDto, 'email' | 'password'>>
  ): Promise<IUserDocument | null> {
    const userDocument = await UserModel.findOneAndUpdate({ email }, updateData, { new: true });
    return userDocument;
  }

  async deleteUser(email: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ email });
    return result.deletedCount === 1;
  }
}
