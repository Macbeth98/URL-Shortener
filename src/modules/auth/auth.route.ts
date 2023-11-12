import { FastifyInstance, RouteOptions } from 'fastify';

import { Routes } from '@interfaces/routes.interface';

import AuthController from '@modules/auth/auth.controller';
import UserController from '@modules/user/user.controller';

import { LoginUserSchema, RegisterUserSchema } from '@modules/auth/validationSchemas/auth.schema';

class AuthRoute implements Routes {
  public path = '/auth';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    const userController = new UserController(fastify);
    const authController = new AuthController(fastify);

    fastify.route({
      method: 'post',
      url: `${this.path}/signup`,
      schema: RegisterUserSchema,
      handler: userController.createUser
    });

    fastify.route({
      method: 'post',
      url: `${this.path}/login`,
      schema: LoginUserSchema,
      handler: authController.login
    });
    done();
  }
}

export default AuthRoute;
