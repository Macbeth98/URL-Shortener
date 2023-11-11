import { Type } from '@fastify/type-provider-typebox';
import { FastifySchema } from 'fastify';
import { ERROR400, ERROR401, ERROR404, ERROR409, ERROR500 } from '@/constants/error.constants';
import { UserTier } from '../modelSchemas/user.model';

export const CreateUserBodySchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email', errorMessage: { format: 'Invalid Email' } }),
  tier: Type.Optional(Type.Enum(UserTier, { default: UserTier.FREE, description: 'Sets the User Tier' }))
});

export const UserResponseSchema = Type.Object({
  _id: Type.String({ pattern: '^[0-9a-fA-F]{24}$' }),
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email' }),
  tier: Type.Enum(UserTier, { default: UserTier.FREE, description: 'Displays the Current User Tier' }),
  createdAt: Type.String({ format: 'date-time' })
});

export const UpdateUserBodySchema = Type.Optional(Type.Omit(CreateUserBodySchema, ['email']));

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
        data: { type: 'object', properties: UserResponseSchema.properties }
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
    required: ['email', 'updateData'],
    properties: {
      email: Type.String({ format: 'email', errorMessage: { format: 'Invalid Email' } }),
      updateData: {
        type: 'object',
        properties: {
          ...UpdateUserBodySchema.properties
        }
      }
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
