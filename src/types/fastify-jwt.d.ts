import { IAuthUser } from '@/modules/auth/interfaces/auth.interface';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: IAuthUser;
  }
}
