import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mongoose from 'mongoose';
import { TIER_LIMITS } from '@/constants/tier.constant';

export const tierRatelimiter = fastifyPlugin((fastify: FastifyInstance, _: unknown, done: () => void) => {
  const tierRatelimiterPreHandlerHook = async (request: FastifyRequest) => {
    const { tier, userId } = request.user;
    const { urlService } = fastify.serviceContainer;

    const today = new Date();

    const filter = {
      userId: new mongoose.Types.ObjectId(userId),
      month: today.getMonth()
    };

    const tierLimit = TIER_LIMITS[tier];

    const urlsCount = await urlService.getCreatedUrlCounts(filter, 0, tierLimit + 1);

    if (urlsCount >= tierLimit) {
      throw fastify.httpErrors.tooManyRequests('Tier Limit Reached: You have reached your monthly limit');
    }
  };

  fastify.decorate('tierRatelimiter', tierRatelimiterPreHandlerHook);
  done();
});
