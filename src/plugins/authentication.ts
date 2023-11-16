import { FastifyInstance, FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { errorContainer } from '@/exceptions/error.container';
import { IAuthUser } from '@/modules/auth/interfaces/auth.interface';

export const authentication = fastifyPlugin((fastify: FastifyInstance, _: unknown, done: () => void) => {
  const authPreValidationHook = async (request: FastifyRequest) => {
    try {
      const jwtToken = request.headers.token as string;

      const payload: IAuthUser = await fastify.serviceContainer.authService.verifyJwtToken(jwtToken);

      if (!payload) {
        throw errorContainer.httpErrors.unauthorized('Unauthorized: Invalid Jwt Token');
      }

      request.user = payload;
    } catch (error) {
      throw errorContainer.httpErrors.unauthorized('Unauthorized: Invalid Jwt Token');
    }
  };
  fastify.decorate('authenticateUser', authPreValidationHook);
  done();
});
