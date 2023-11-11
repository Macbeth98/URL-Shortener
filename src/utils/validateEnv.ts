import { Type } from '@sinclair/typebox';

export const schema = Type.Object({
  NODE_ENV: Type.String(),
  PORT: Type.Number() || Type.String(),
  DATABASE_URL: Type.String(),
  SECRET_KEY: Type.String()
});
