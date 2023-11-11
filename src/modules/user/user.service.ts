import { hash } from 'bcrypt';

import { FastifyInstance } from 'fastify';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from './dtos/user.dto';
import { IUserDAO } from './daos/IUserDAO';
import { User } from './interfaces/user.interface';
import { OrderValueBy } from '@/constants/db.constants';

class UserService {
  private fastify;

  private userDao: IUserDAO;

  private saltRounds = 10;

  constructor(fastify: FastifyInstance, userDao: IUserDAO) {
    this.fastify = fastify;
    this.userDao = userDao;
  }

  public async createUser(createData: CreateUserDto): Promise<User> {
    const checkUserExists = await this.userDao.getUserByEmail(createData.email);

    if (checkUserExists) {
      throw this.fastify.httpErrors.conflict('User already exists');
    }

    const hashedPassword = await hash(createData.password, this.saltRounds);

    const user = await this.userDao.createUser({ ...createData, password: hashedPassword });

    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userDao.getUserByEmail(email);

    if (!user) {
      throw this.fastify.httpErrors.notFound('User not found');
    }

    return user;
  }

  public async getUser(filterBy: { email?: string; username?: string }): Promise<User> {
    const user = await this.userDao.getUser(filterBy);

    if (!user) {
      throw this.fastify.httpErrors.notFound('User not found');
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

  public async updateUser(email: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.userDao.updateUser(email, updateData);

    if (!user) {
      throw this.fastify.httpErrors.notFound('User not found');
    }

    return user;
  }
}

export default UserService;
