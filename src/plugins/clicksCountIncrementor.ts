import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { ProcessUrlParamsDto } from '@/modules/url/dtos/url.dto';

export const clicksCountIncrementor = fastifyPlugin((fastify: FastifyInstance, _: unknown, done: () => void) => {
  const clickIncrementResponseHook = async (
    req: FastifyRequest<{ Params: ProcessUrlParamsDto }>,
    reply: FastifyReply
  ) => {
    const { urlService } = fastify.serviceContainer;
    const { alias } = req.params;

    if (reply.statusCode !== 302) {
      return;
    }

    await urlService.incrementClicks(alias);
  };

  fastify.decorate('clicksCountIncrementor', clickIncrementResponseHook);
  done();
});
