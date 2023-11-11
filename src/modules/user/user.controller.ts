import { FastifyInstance, FastifyRequest } from 'fastify';

import UserService from '@modules/user/user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { MongoUserDAO } from './daos/mongo-user.dao';

class UserController {
  public userService: UserService;

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify, new MongoUserDAO());
  }

  public createUser = async (req: FastifyRequest<{ Body: CreateUserDto }>) => {
    const user = await this.userService.createUser(req.body);

    return user;
  };

  public getUser = async (req: FastifyRequest) => {
    const email = req.user as string;

    const user = await this.userService.getUser({ email });

    return user;
  };

  public updateUser = async (req: FastifyRequest<{ Body: UpdateUserDto }>) => {
    const email = req.user as string;
    const updateData = req.body;

    const user = await this.userService.updateUser(email, updateData);

    return user;
  };
}

export default UserController;
