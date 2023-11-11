import { Static } from '@fastify/type-provider-typebox';

import { CreateUserBodySchema, UserResponseSchema } from '@/modules/user/validationSchemas/user.schema';

export interface CreateUserDto extends Static<typeof CreateUserBodySchema> {}

export interface UserResponseDto extends Static<typeof UserResponseSchema> {}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'email' | 'password'>>;

export type GetAllUsersDto = Partial<UserResponseDto>;
