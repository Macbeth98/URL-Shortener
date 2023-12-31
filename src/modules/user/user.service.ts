import { ClientSession } from 'mongoose';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from './dtos/user.dto';
import { IUserDAO } from './interfaces/user-dao.interface';
import { IUser } from './interfaces/user.interface';
import { OrderValueBy } from '@/constants/db.constant';
import { errorContainer } from '@/exceptions/error.container';

class UserService {
  private userDao: IUserDAO;

  constructor(userDao: IUserDAO) {
    this.userDao = userDao;
  }

  public async createUser(createData: CreateUserDto, session?: ClientSession): Promise<IUser> {
    const [emailUserExists, usernameUserExists] = await Promise.all([
      this.userDao.getUser({ email: createData.email.toLowerCase() }),
      this.userDao.getUser({ username: createData.username.toLowerCase() })
    ]);

    let message = '';

    if (emailUserExists && usernameUserExists) {
      message = 'Email and username already exists';
    } else if (emailUserExists) {
      message = 'Email already exists';
    } else if (usernameUserExists) {
      message = 'Username already exists';
    }

    if (message.length > 1) {
      throw errorContainer.httpErrors.conflict(message);
    }

    const user = await this.userDao.createUser(createData, session);

    return user;
  }

  public async getUserByEmailOrUsername(email?: string, username?: string): Promise<IUser> {
    if (!email && !username) {
      throw errorContainer.httpErrors.badRequest('Email or username is required');
    }

    const user = await this.userDao.getUserByEmailOrUsername(email, username);

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    return user;
  }

  public async getUser(filterBy: { email?: string; username?: string }): Promise<IUser> {
    const user = await this.userDao.getUser(filterBy);

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    return user;
  }

  public async getAllUsers(
    filterBy: GetAllUsersDto,
    skip: number,
    limit: number,
    sortBy: string,
    order: OrderValueBy
  ): Promise<IUser[]> {
    const users = await this.userDao.getAllUsers(filterBy, skip, limit, sortBy, order);

    return users;
  }

  public async updateUser(email: string, updateData: UpdateUserDto, session?: ClientSession): Promise<IUser> {
    if (updateData.username) {
      updateData.displayUsername = updateData.username;

      const usernameUserExists = await this.userDao.getUser({ username: updateData.username.toLowerCase() });
      if (usernameUserExists) {
        throw errorContainer.httpErrors.conflict('Username already exists');
      }
    }
    const user = await this.userDao.updateUser(email, updateData, session);

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    return user;
  }
}

export default UserService;
