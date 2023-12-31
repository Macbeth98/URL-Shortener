import { Type } from '@fastify/type-provider-typebox';
import { FastifySchema } from 'fastify';
import { ERROR400, ERROR401, ERROR404, ERROR409, ERROR500 } from '@/constants/error.constant';
import { UserTier } from '@/utils/enum.type';

export const CreateUserBodySchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email', errorMessage: { format: 'Invalid Email' } }),
  tier: Type.Optional(
    Type.Enum(UserTier, { default: UserTier.FREE, description: 'Sets the User Tier. User Tiers: FREE | PRO | PREMIUM' })
  )
});

export const UserResponseSchema = Type.Object({
  _id: Type.Optional(Type.String({ pattern: '^[0-9a-fA-F]{24}$' }) || Type.Object({})),
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email' }),
  tier: Type.String(Type.Enum(UserTier, { default: UserTier.FREE, description: 'Displays the Current User Tier' })),
  displayUsername: Type.Optional(Type.String({ minLength: 3, maxLength: 20 })),
  createdAt: Type.String({ format: 'date-time' })
});

export const UpdateUserBodySchema = Type.Optional(Type.Omit(CreateUserBodySchema, ['email', 'tier']));

export const CreateUserSchema: FastifySchema = {
  description: 'Create user api',
  tags: ['user'],
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      ...CreateUserBodySchema.properties
    }
  },
  response: {
    201: {
      description: 'Successful created User',
      type: 'object',
      properties: {
        ...UserResponseSchema.properties
      }
    },
    400: ERROR400,
    409: ERROR409,
    500: ERROR500
  }
};

export const GetUserSchema: FastifySchema = {
  description: 'Get user api',
  tags: ['user'],
  response: {
    200: {
      description: 'Successful get response',
      type: 'object',
      properties: {
        ...UserResponseSchema.properties
      }
    },
    400: ERROR400,
    401: ERROR401,
    404: ERROR404,
    500: ERROR500
  },
  security: [
    {
      token: []
    }
  ]
};

export const UpdateUserSchema: FastifySchema = {
  description: 'Update user api',
  tags: ['user'],
  body: {
    type: 'object',
    properties: {
      ...UpdateUserBodySchema.properties
    }
  },
  response: {
    200: {
      description: 'Successful updated User',
      type: 'object',
      properties: {
        ...UserResponseSchema.properties
      }
    },
    400: ERROR400,
    401: ERROR401,
    404: ERROR404,
    500: ERROR500
  },
  security: [
    {
      token: []
    }
  ]
};
