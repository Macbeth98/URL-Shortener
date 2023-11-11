import { FastifyInstance, RouteOptions } from 'fastify';

import { Routes } from '@interfaces/routes.interface';

import IndexController from '@modules/default/index.controller';
import { PingResponseSchema } from '@modules/default/index.dto';

class IndexRoute implements Routes {
  public path = '/';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    fastify.route({
      method: 'GET',
      url: this.path,
      schema: {
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: PingResponseSchema.properties
          }
        }
      },
      handler: IndexController.index
    });
    done();
  }
}

export default IndexRoute;
