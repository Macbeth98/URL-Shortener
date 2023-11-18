import { Static } from '@fastify/type-provider-typebox';
import {
  CreateUrlRequestSchema,
  CreateUrlResponseSchema,
  GetTierLimitResponseSchema,
  GetUrlQuerySchema,
  ProcessUrlParamsSchema
} from '@modules/url/validationSchemas/url.schema';
import { ObjectId } from 'mongoose';

export interface CreateUrlRequestDto extends Static<typeof CreateUrlRequestSchema> {
  email: string;
}

export interface CreateUrlResponseDto extends Static<typeof CreateUrlResponseSchema> {}

export interface ProcessUrlParamsDto extends Static<typeof ProcessUrlParamsSchema> {}

export interface GetUrlQueryDto extends Static<typeof GetUrlQuerySchema> {
  email: string;
  userId?: string | ObjectId;
}

export interface GetTierLimitsDto extends Static<typeof GetTierLimitResponseSchema> {}
