import { FastifyReply, FastifyRequest } from 'fastify';
import { Static } from '@fastify/type-provider-typebox';
import { schema } from '@utils/validateEnv';
import mongoose from 'mongoose';
import { ServiceContainer } from '@/modules/containers/service.container';

declare module 'fastify' {
  interface FastifyInstance {
    authenticateUser?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof schema>;
    mongoose: typeof mongoose;
    mongo: typeof mongoose.connection.db;
  }
}

// Injecting the Class Instances.

declare module 'fastify' {
  interface FastifyInstance {
    serviceContainer: ServiceContainer;
  }
}
