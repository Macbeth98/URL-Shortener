import { ClientSession } from 'mongoose';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from './dtos/user.dto';
import { IUserDAO } from './daos/IUserDAO';
import { IUserDocument, User } from './interfaces/user.interface';
import { OrderValueBy } from '@/constants/db.constants';
import { errorContainer } from '@/exceptions/error.container';

class UserService {
  private userDao: IUserDAO;

  constructor(userDao: IUserDAO) {
    this.userDao = userDao;
  }

  public async createUser(createData: CreateUserDto, session?: ClientSession): Promise<IUserDocument> {
    const userExists = await Promise.all([
      this.userDao.getUser({ email: createData.email.toLowerCase() }),
      this.userDao.getUser({ username: createData.username.toLowerCase() })
    ]);

    if (userExists.length > 0) {
      const message = userExists[0] ? 'Email already exists' : 'Username already exists';

      throw errorContainer.httpErrors.conflict(message);
    }

    const user = await this.userDao.createUser(createData, session);

    return user;
  }

  public async getUserByEmailOrUsername(email?: string, username?: string): Promise<User> {
    if (!email && !username) {
      throw errorContainer.httpErrors.badRequest('Email or username is required');
    }

    const user = await this.userDao.getUserByEmailOrUsername(email, username);

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    return user;
  }

  public async getUser(filterBy: { email?: string; username?: string }): Promise<User> {
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
  ): Promise<User[]> {
    const users = await this.userDao.getAllUsers(filterBy, skip, limit, sortBy, order);

    return users;
  }

  public async updateUser(email: string, updateData: UpdateUserDto, session?: ClientSession): Promise<User> {
    const user = await this.userDao.updateUser(email, updateData, session);

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    return user;
  }
}

export default UserService;
