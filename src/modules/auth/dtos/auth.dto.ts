import { Static } from '@fastify/type-provider-typebox';
import {
  LoginUserBodySchema,
  LoginUserResponseSchema,
  SignupUserBodySchema,
  SignupUserResponseSchema
} from '../validationSchemas/auth.schema';

export interface SignupUserDto extends Static<typeof SignupUserBodySchema> {}

export interface SignupUserResponseDto extends Static<typeof SignupUserResponseSchema> {}

export interface LoginUserDto extends Static<typeof LoginUserBodySchema> {}

export interface LoginUserResponseDto extends Static<typeof LoginUserResponseSchema> {}
