import { Type } from '@fastify/type-provider-typebox';
import { FastifySchema } from 'fastify';
import { CreateUserBodySchema, UserResponseSchema } from '@modules/user/validationSchemas/user.schema';
import { ERROR400, ERROR409, ERROR500 } from '@/constants/error.constants';

const passwordSchema = Type.String({
  format: 'regex',
  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-])(?=.{8,})',
  errorMessage: {
    pattern: 'password must minimum of 8 characters, 1 uppercase, lowercase, number and a special character'
  }
});

export const SignupUserBodySchema = Type.Object({
  ...CreateUserBodySchema.properties,
  password: passwordSchema
});

export const SignupUserResponseSchema = Type.Object({
  status: Type.String({ default: 'OK' }),
  user: UserResponseSchema,
  message: Type.String({ default: 'User created successfully' }),
  codeDeliveryDetails: Type.Object({
    AttributeName: Type.String({ description: 'Code or link' }),
    DeliveryMedium: Type.String({ description: 'The medium used to send the code/link.' }),
    Destination: Type.String({ format: 'email', description: 'Email address where the code/link was sent.' })
  })
});

export const LoginUserBodySchema = Type.Object({
  email: Type.String({ format: 'email', errorMessage: { format: 'Invalid Email' } }),
  password: passwordSchema
});

export const LoginUserResponseSchema = Type.Object({
  status: Type.String({ default: 'OK' }),
  message: Type.String({ default: 'User logged in successfully' }),
  user: UserResponseSchema,
  tokenExpiresIn: Type.Number({ description: 'Token expiry time in seconds' }),
  accessToken: Type.String({ description: 'JWT access token' }),
  idToken: Type.String({ description: 'JWT id token that needs to be sent in the request headers.' }),
  refreshToken: Type.String({ description: 'JWT refresh token.' })
});

export const SignupUserSchema: FastifySchema = {
  description: 'Signup / Register user',
  tags: ['auth'],
  summary: 'Signup / Register user',
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      ...SignupUserBodySchema.properties
    }
  },
  response: {
    201: {
      description: 'Successful created User',
      type: 'object',
      properties: {
        ...SignupUserResponseSchema.properties
      }
    },
    400: ERROR400,
    409: ERROR409,
    500: ERROR500
  }
};

export const LoginUserSchema: FastifySchema = {
  description: 'Login user',
  tags: ['auth'],
  summary: 'Login user',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      ...LoginUserBodySchema.properties
    }
  },
  response: {
    200: {
      description: 'Successful login User',
      type: 'object',
      properties: {
        ...LoginUserResponseSchema.properties
      }
    },
    400: ERROR400,
    409: ERROR409,
    500: ERROR500
  }
};
