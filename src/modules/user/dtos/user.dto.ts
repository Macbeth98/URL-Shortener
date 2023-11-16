import { Static } from '@fastify/type-provider-typebox';

import { CreateUserBodySchema, UserResponseSchema } from '@/modules/user/validationSchemas/user.schema';
import { IUser } from '../interfaces/user.interface';

export interface CreateUserDto extends Static<typeof CreateUserBodySchema> {}

export interface UserResponseDto extends Omit<Static<typeof UserResponseSchema>, 'createdAt'> {
  createdAt: Date;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'email' | 'password'>> {
  displayUsername?: IUser['displayUsername'];
}

export type GetAllUsersDto = Partial<UserResponseDto>;
