import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible';
import AuthService from '../auth/auth.service';
import UserService from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

export class ServiceContainer {
  fastify!: FastifyInstance;

  config!: FastifyInstance['config'];

  logger!: FastifyInstance['log'];

  httpErrors!: HttpErrors;

  userService!: UserService;

  authService!: AuthService;

  public async init(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.config = fastify.config;
    this.logger = fastify.log;
    this.httpErrors = fastify.httpErrors;

    this.userService = (await UserModule.register()).userService;
    this.authService = (await AuthModule.register(this.userService)).authService;
  }
}

export const serviceContainer = new ServiceContainer();
