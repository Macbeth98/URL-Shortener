import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import AuthService from '@modules/auth/auth.service';
import { LoginUserDto } from './dtos/auth.dto';

class AuthController {
  private authService: AuthService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify);
  }

  public login = async (req: FastifyRequest<{ Body: LoginUserDto }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    const data = await this.authService.LoginUser({ email, password }, reply);

    return { data, message: 'login' };
  };
}

export default AuthController;
