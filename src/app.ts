import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import ajvErrors from 'ajv-errors';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyJwt from '@fastify/jwt';
import fastifyEnv from '@fastify/env';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';

import { initializeRoutes } from '@plugins/initializeRoute';
import { authentication } from '@plugins/authentication';
import { initSwagger } from '@plugins/swagger';
import mongodbPlugin from '@plugins/mongodb';

import { schemaErrorFormatter } from '@utils/schemaErrorFormatter';
import { envOptions } from '@config';
import { serviceContainer } from './modules/containers/service.container';
import { errorContainer } from './exceptions/error.container';
import { tierRatelimiter } from './plugins/tierRatelimiter';
import { clicksCountIncrementor } from './plugins/clicksCountIncrementor';

class App {
  public app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      schemaErrorFormatter,
      ajv: {
        customOptions: {
          coerceTypes: false,
          allErrors: true
        },
        plugins: [ajvErrors]
      },
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: true,
            colorize: true
          }
        }
      }
    }).withTypeProvider<TypeBoxTypeProvider>();
  }

  public async listen() {
    try {
      await this.init();

      await this.app.listen({ port: Number(this.app.config.PORT) });
    } catch (err) {
      this.app.log.error(err);
      process.exit(1);
    }
  }

  public getServer() {
    return this.app;
  }

  private async init() {
    await this.initializePlugins();
    await this.initializeJwtPlugin();
    await this.initializeContainers();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializePlugins() {
    await this.app.register(fastifyEnv, envOptions);
    await this.app.register(mongodbPlugin, { uri: this.app.config.DATABASE_URL });
    await this.app.register(fastifyRateLimit, {
      max: 60,
      timeWindow: '1 minute',
      allowList: ['127.0.0.1']
    });
    this.app.register(fastifyCors, { origin: true });
    this.app.register(fastifyHelmet);
    this.app.register(fastifyCompress);
    await this.app.register(fastifySensible);
    await this.app.register(authentication);
    await this.app.register(tierRatelimiter);
    await this.app.register(clicksCountIncrementor);
    this.app.register(initSwagger);
  }

  private async initializeContainers() {
    await errorContainer.init(this.app);
    await serviceContainer.init(this.app);
    this.app.decorate('serviceContainer', serviceContainer);
  }

  private async initializeJwtPlugin() {
    await this.app.register(fastifyJwt, {
      secret: () => serviceContainer.jwtSecret(this.app.config)
    });
  }

  private initializeRoutes() {
    this.app.register(initializeRoutes);
  }

  private initializeErrorHandling() {
    this.app.setErrorHandler((error: FastifyError, request, reply) => {
      if (error.statusCode === 429) {
        return reply
          .status(429)
          .send({ status: false, message: 'Too many requests. You hit the rate limit! Slow down please!' });
      }

      const status: number = error.statusCode ?? 500;
      // const message: string = status === 500 ? 'Something went wrong' : error.message ?? 'Something went wrong';
      let message: string = 'Something went wrong';

      if (error.message) {
        message = error.message;
      } else if (error.validation) {
        message = error.validation[0].message;
      }

      this.app.log.error(`[${request.method}] ${request.url} >> StatusCode:: ${status}, Message:: ${message}`);
      this.app.log.error(error);

      return reply.status(status).send({ status: false, message });
    });
  }
}

export default App;
