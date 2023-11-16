import { FastifyInstance, RouteOptions } from 'fastify';
import { UrlService } from './url.service';
import { CreateUrlSchema, GetUrlSchema, ProcessUrlSchema } from './validationSchemas/url.schema';
import { UrlController } from './url.controller';
import { Routes } from '@/interfaces/routes.interface';

class UrlRoute implements Routes {
  public path = '/url';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    const { urlService }: { urlService: UrlService } = fastify.serviceContainer;
    const urlController = new UrlController(urlService);

    fastify.route({
      method: 'post',
      url: this.path,
      schema: CreateUrlSchema,
      preValidation: fastify.authenticateUser,
      preHandler: fastify.tierRatelimiter,
      handler: urlController.createShortUrl
    });

    fastify.route({
      method: 'get',
      url: this.path,
      schema: GetUrlSchema,
      preValidation: fastify.authenticateUser,
      handler: urlController.getShortUrl
    });

    fastify.route({
      method: 'get',
      url: `/:alias`,
      schema: ProcessUrlSchema,
      handler: urlController.processShortUrl,
      onResponse: fastify.clicksCountIncrementor
    });

    done();
  }
}

export default UrlRoute;
