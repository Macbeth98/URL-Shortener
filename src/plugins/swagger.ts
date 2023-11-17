import { FastifyInstance } from 'fastify';
import fastifySwagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { fastifyPlugin } from 'fastify-plugin';

export const initSwagger = fastifyPlugin((fastify: FastifyInstance, _: unknown, done: () => void) => {
  const opts: FastifyDynamicSwaggerOptions = {
    swagger: {
      info: {
        title: 'URL Shortener API',
        description: "Swagger documentation for the URL Shortener API's",
        version: '1.0.0'
      },
      tags: [
        { name: 'default', description: 'PING' },
        { name: 'auth', description: 'Authentication end-points' },
        { name: 'user', description: 'User related end-points' },
        { name: 'url', description: 'URL related end-points (Shortening of Url)' }
      ],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        token: {
          type: 'apiKey',
          name: 'token',
          in: 'header'
        }
      },
      schemes: ['https', 'http'],
      security: []
    }
  };

  fastify.register(fastifySwagger, opts);

  const uiOpts: FastifySwaggerUiOptions = {
    routePrefix: '/api-docs',
    staticCSP: true,
    transformStaticCSP: (header) => header,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  };

  fastify.register(fastifySwaggerUi, uiOpts);
  done();
});
