import { Static } from '@fastify/type-provider-typebox';
import {
  CreateUrlRequestSchema,
  CreateUrlResponseSchema,
  GetUrlParamsSchema,
  GetUrlQuerySchema
} from '@modules/url/validationSchemas/url.schema';
import { ObjectId } from 'mongoose';

export interface CreateUrlRequestDto extends Static<typeof CreateUrlRequestSchema> {
  email: string;
}

export interface CreateUrlResponseDto extends Static<typeof CreateUrlResponseSchema> {}

export interface GetUrlParamsDto extends Static<typeof GetUrlParamsSchema> {}

export interface GetUrlQueryDto extends Static<typeof GetUrlQuerySchema> {
  email: string;
  userId?: string | ObjectId;
}
