import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@interfaces/routes.interface';

import AuthRoute from '@modules/auth/auth.route';
import IndexRoute from '@modules/default/index.route';
import UserRoute from '@modules/user/user.route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, options, done) => {
  // add the new routes here
  const routes = [new IndexRoute(), new UserRoute(), new AuthRoute()];
  routes.forEach((route: Routes) => {
    server.register(route.initializeRoutes.bind(route));
  });
  done();
};
