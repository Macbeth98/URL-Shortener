import { Static } from '@fastify/type-provider-typebox';

import { CreateUserBodySchema, UserResponseSchema } from '@/modules/user/validationSchemas/user.schema';

export interface CreateUserDto extends Static<typeof CreateUserBodySchema> {}

export interface UserResponseDto extends Omit<Static<typeof UserResponseSchema>, 'createdAt'> {
  createdAt: Date;
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'email' | 'password'>>;

export type GetAllUsersDto = Partial<UserResponseDto>;
