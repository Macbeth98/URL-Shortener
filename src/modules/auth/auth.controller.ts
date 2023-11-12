import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import AuthService from '@modules/auth/auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dtos/auth.dto';

class AuthController {
  private authService: AuthService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify, fastify.userService);
  }

  public signup = async (req: FastifyRequest<{ Body: RegisterRequestDto }>, reply: FastifyReply) => {
    const user = await this.authService.registerUser(req.body);
    reply.status(201).send({ data: user, message: 'signup' });
  };

  public login = async (req: FastifyRequest<{ Body: LoginRequestDto }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    const data = await this.authService.loginUser({ email, password }, reply);

    return { data, message: 'login' };
  };
}

export default AuthController;
