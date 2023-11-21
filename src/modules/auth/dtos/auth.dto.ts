import { Static } from '@fastify/type-provider-typebox';
import {
  ForgotPasswordResponseSchema,
  LoginUserBodySchema,
  LoginUserResponseSchema,
  RegisterUserBodySchema,
  RegisterUserResponseSchema,
  ResetPasswordRequestSchema,
  ResetPasswordResponseSchema,
  UpdateUserTierBodySchema
} from '../validationSchemas/auth.schema';
import { IUser } from '@/modules/user/interfaces/user.interface';

export interface RegisterRequestDto extends Static<typeof RegisterUserBodySchema> {
  _id?: IUser['_id'];
  displayUsername?: IUser['displayUsername'];
}

export interface RegisterResponseDto extends Omit<Static<typeof RegisterUserResponseSchema>, 'user.createdAt'> {}

export interface LoginRequestDto extends Static<typeof LoginUserBodySchema> {}

export interface LoginResponseDto extends Static<typeof LoginUserResponseSchema> {}

export interface ForgotPasswordResponseDto extends Static<typeof ForgotPasswordResponseSchema> {}

export interface ResetPasswordRequestDto extends Static<typeof ResetPasswordRequestSchema> {}

export interface ResetPasswordResponseDto extends Static<typeof ResetPasswordResponseSchema> {}

export interface UpdateUserTierRequestDto extends Static<typeof UpdateUserTierBodySchema> {}
