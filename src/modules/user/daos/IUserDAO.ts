import { OrderValueBy } from '@constants/db.constants';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from '../dtos/user.dto';
import { IUserDocument } from '../interfaces/user.interface';

export interface IUserDAO {
  createUser: (createData: CreateUserDto) => Promise<IUserDocument>;
  getUserByEmail: (email: string) => Promise<IUserDocument | null>;
  getUser: (filterBy: { email?: string; username?: string }) => Promise<IUserDocument | null>;
  getAllUsers: (
    filterBy: GetAllUsersDto,
    skip: number,
    limit: number,
    sortBy: string,
    order: OrderValueBy
  ) => Promise<IUserDocument[]>;
  updateUser: (email: string, updateData: UpdateUserDto) => Promise<IUserDocument | null>;
  deleteUser: (email: string) => Promise<boolean>;
}
