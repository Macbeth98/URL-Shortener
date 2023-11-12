import { Routes } from '@interfaces/routes.interface';
import { FastifyInstance, RouteOptions } from 'fastify';
import UserController from '@modules/user/user.controller';

import { GetUserSchema, UpdateUserSchema } from '@/modules/user/validationSchemas/user.schema';
import UserService from './user.service';

class UserRoute implements Routes {
  public path = '/user';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    const { userService }: { userService: UserService } = fastify.serviceContainer;
    const userController = new UserController(userService);

    fastify.route({
      method: 'get',
      url: this.path,
      schema: GetUserSchema,
      preHandler: fastify.authenticateUser,
      handler: userController.getUser
    });

    fastify.route({
      method: 'put',
      url: this.path,
      schema: UpdateUserSchema,
      preHandler: fastify.authenticateUser,
      handler: userController.updateUser
    });

    done();
  }
}

export default UserRoute;
