import { Static, Type } from '@fastify/type-provider-typebox';

export const PingResponseSchema = Type.Object({
  status: Type.String({ example: 'OK' }),
  message: Type.String({ example: 'Hello World, From URL Shortener' }),
  timestamp: Type.String({ example: '2021-09-19T14:46:36.000Z' })
});

export interface IPingResponseDto extends Static<typeof PingResponseSchema> {}
