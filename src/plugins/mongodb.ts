import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose, { MongooseError } from 'mongoose';

interface MongoPluginOptions {
  uri: string;
}

const mongodbPlugin = fp<MongoPluginOptions>(async (fastify: FastifyInstance, options: MongoPluginOptions, done) => {
  try {
    const dbConnection = await mongoose.connect(options.uri);

    fastify.log.info('MongoDB Connected');

    fastify.decorate('mongoose', mongoose);

    fastify.decorate('mongo', dbConnection.connection.db);

    fastify.addHook('onClose', async () => {
      await dbConnection.disconnect();
    });

    done();
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      fastify.log.error('MongoDB Error', `MongoDB error: ${err.message}`);
    } else {
      fastify.log.error('MongoDB Unknown Error', `MongoDB error: ${err}`);
    }
    process.exit(1);
  }
});

export default mongodbPlugin;
