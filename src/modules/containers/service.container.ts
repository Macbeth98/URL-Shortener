import { FastifyInstance } from 'fastify';
import { HttpErrors } from '@fastify/sensible';
import AuthService from '../auth/auth.service';
import UserService from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UrlService } from '../url/url.service';
import { UrlModule } from '../url/url.module';
import { IConfig } from '@/utils/validateEnv';

/**
 * @dev This class is used to store all the services that are used in the application.
 * @dev This class is created to avoid the service layer dependency on Fastify Framework, especially in this case, the FastifyInstance.
 * @dev Otherwise to use Fastify Plugins such as I would have to import FastifyInstance in the service layer, which I don't want to.
 * @dev I tried designing the application in such a way that the service layer is independent of the framework. I can easily swap out Fastify with Express or Koa.
 *      Just by changing the Routing layer and this ServiceContainer class.
 * @dev This class is a singleton class, so that the services are instantiated only once. And those services are instantiated in its own Module.
 * @dev This class also serves as a dependency injection container and also to avoid any circular dependency.
 *      Instead of being tightly coupled with the fastify instance, the service layer now uses this ServiceContainer class to access the services.
 * @dev This class is initialized when the fastify instance is created and is decorated to fastify to access in the Routing layer.
 *      So that the Routing layer can access the services and do service layer dependency injection to the controllers.
 */

export class ServiceContainer {
  private initialUrlCounter = 3844;

  fastify!: FastifyInstance;

  config!: FastifyInstance['config'];

  logger!: FastifyInstance['log'];

  jwt!: FastifyInstance['jwt'];

  jwtSecret!: (config: IConfig) => Promise<string>;

  httpErrors!: HttpErrors;

  userService!: UserService;

  authService!: AuthService;

  urlService!: UrlService;

  constructor() {
    this.jwtSecret = AuthModule.jwtSecret;
  }

  public async init(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.config = fastify.config;
    this.logger = fastify.log;
    this.jwt = fastify.jwt;
    this.httpErrors = fastify.httpErrors;

    this.userService = (await UserModule.register()).userService;
    this.authService = (await AuthModule.register(this.userService, this)).authService;
    this.urlService = (await UrlModule.register(this.initialUrlCounter, fastify.mongo, this.userService)).urlService;
  }
}

export const serviceContainer = new ServiceContainer();
