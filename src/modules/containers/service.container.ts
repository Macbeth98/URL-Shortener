import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible';
import AuthService from '../auth/auth.service';
import UserService from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UrlService } from '../url/url.service';
import { UrlModule } from '../url/url.module';

export class ServiceContainer {
  private initialUrlCounter = 3844;

  fastify!: FastifyInstance;

  config!: FastifyInstance['config'];

  logger!: FastifyInstance['log'];

  jwt!: FastifyInstance['jwt'];

  httpErrors!: HttpErrors;

  userService!: UserService;

  authService!: AuthService;

  urlService!: UrlService;

  public async init(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.config = fastify.config;
    this.logger = fastify.log;
    this.jwt = fastify.jwt;
    this.httpErrors = fastify.httpErrors;

    this.userService = (await UserModule.register()).userService;
    this.authService = (await AuthModule.register(this.userService)).authService;
    this.urlService = (await UrlModule.register(this.initialUrlCounter, fastify.mongo, this.userService)).urlService;
  }
}

export const serviceContainer = new ServiceContainer();
