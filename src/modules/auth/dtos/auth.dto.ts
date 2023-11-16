import { Static } from '@fastify/type-provider-typebox';
import {
  LoginUserBodySchema,
  LoginUserResponseSchema,
  RegisterUserBodySchema,
  RegisterUserResponseSchema
} from '../validationSchemas/auth.schema';
import { IUser } from '@/modules/user/interfaces/user.interface';

export interface RegisterRequestDto extends Static<typeof RegisterUserBodySchema> {
  _id?: IUser['_id'];
}

export interface RegisterResponseDto extends Omit<Static<typeof RegisterUserResponseSchema>, 'user.createdAt'> {}

export interface LoginRequestDto extends Static<typeof LoginUserBodySchema> {}

export interface LoginResponseDto extends Static<typeof LoginUserResponseSchema> {}
