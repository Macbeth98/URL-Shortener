import { Static } from '@fastify/type-provider-typebox';
import {
  LoginUserBodySchema,
  LoginUserResponseSchema,
  RegisterUserBodySchema,
  RegisterUserResponseSchema
} from '../validationSchemas/auth.schema';

export interface RegisterRequestDto extends Static<typeof RegisterUserBodySchema> {}

export interface RegisterResponseDto extends Static<typeof RegisterUserResponseSchema> {}

export interface LoginRequestDto extends Static<typeof LoginUserBodySchema> {}

export interface LoginResponseDto extends Static<typeof LoginUserResponseSchema> {}
