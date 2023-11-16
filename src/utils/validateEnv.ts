import { Type, Static } from '@sinclair/typebox';

export const schema = Type.Object({
  NODE_ENV: Type.String(),
  PORT: Type.Number() || Type.String(),
  DATABASE_URL: Type.String(),
  SECRET_KEY: Type.String(),
  AWS_COGNITO_USER_POOL_ID: Type.String(),
  AWS_COGNITO_CLIENT_ID: Type.String(),
  AWS_REGION: Type.String(),
  SHORT_URL: Type.String()
});

export const typeBoxEnvSchema = schema;
export interface IConfig extends Static<typeof schema> {}
