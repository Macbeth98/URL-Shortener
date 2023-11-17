import { FastifyInstance } from 'fastify';

import { HttpErrors } from '@fastify/sensible';

export class ErrorContainer {
  public httpErrors!: HttpErrors;

  public async init(fastify: FastifyInstance) {
    this.httpErrors = fastify.httpErrors;
  }
}

export const errorContainer = new ErrorContainer();
