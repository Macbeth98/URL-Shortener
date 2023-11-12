const envSchema = {
  type: 'object',
  required: ['NODE_ENV', 'PORT', 'DATABASE_URL', 'SECRET_KEY'],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    PORT: {
      type: 'number' || 'string',
      default: 3000
    },
    DATABASE_URL: {
      type: 'string'
    },
    SECRET_KEY: {
      type: 'string'
    },
    AWS_COGNITO_USER_POOL_ID: {
      type: 'string'
    },
    AWS_COGNITO_CLIENT_ID: {
      type: 'string'
    },
    AWS_REGION: {
      type: 'string'
    }
  }
};

const envOptions = {
  // dotenv: true,
  dotenv: {
    path: `.env.${process.env.NODE_ENV ?? 'development'}`,
    debug: true
  },
  schema: envSchema
};

export { envOptions };
