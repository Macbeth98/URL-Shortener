import { ClientSession } from 'mongoose';
import { OrderValueBy } from '@/constants/db.constant';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from '../dtos/user.dto';
import { IUser } from './user.interface';

export interface IUserDAO {
  createUser: (createData: CreateUserDto, session?: ClientSession) => Promise<IUser>;
  getUserByEmailOrUsername: (email?: string, username?: string) => Promise<IUser | null>;
  getUser: (filterBy: { email?: string; username?: string }) => Promise<IUser | null>;
  getAllUsers: (
    filterBy: GetAllUsersDto,
    skip: number,
    limit: number,
    sortBy: string,
    order: OrderValueBy
  ) => Promise<IUser[]>;
  updateUser: (email: string, updateData: UpdateUserDto, session?: ClientSession) => Promise<IUser | null>;
  deleteUser: (email: string, session?: ClientSession) => Promise<boolean>;
}
