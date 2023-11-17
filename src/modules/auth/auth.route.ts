import { FastifyInstance, RouteOptions } from 'fastify';

import { Routes } from '@interfaces/routes.interface';

import AuthController from '@modules/auth/auth.controller';

import {
  ForgotPasswordSchema,
  LoginUserSchema,
  RegisterUserSchema,
  ResendConfirmationSchema,
  ResetPasswordSchema,
  UpdateUserTierSchema
} from '@modules/auth/validationSchemas/auth.schema';

class AuthRoute implements Routes {
  public path = '/auth';

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    const authController = new AuthController(fastify.serviceContainer.authService);

    fastify.route({
      method: 'post',
      url: `${this.path}/signup`,
      schema: RegisterUserSchema,
      handler: authController.signup
    });

    fastify.route({
      method: 'post',
      url: `${this.path}/resendConfirmation`,
      schema: ResendConfirmationSchema,
      handler: authController.resendConfirmation
    });

    fastify.route({
      method: 'post',
      url: `${this.path}/login`,
      schema: LoginUserSchema,
      handler: authController.login
    });

    fastify.route({
      method: 'post',
      url: `${this.path}/forgotPassword`,
      schema: ForgotPasswordSchema,
      handler: authController.forgotPassword
    });

    fastify.route({
      method: 'post',
      url: `${this.path}/resetPassword`,
      schema: ResetPasswordSchema,
      handler: authController.resetPassword
    });

    fastify.route({
      method: 'put',
      url: `${this.path}/updateTier`,
      schema: UpdateUserTierSchema,
      preValidation: fastify.authenticateUser,
      handler: authController.updateUserTier
    });
    done();
  }
}

export default AuthRoute;
