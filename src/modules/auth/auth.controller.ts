import { FastifyReply, FastifyRequest } from 'fastify';

import AuthService from '@modules/auth/auth.service';
import { LoginRequestDto, RegisterRequestDto, UpdateUserTierRequestDto } from './dtos/auth.dto';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public signup = async (req: FastifyRequest<{ Body: RegisterRequestDto }>, reply: FastifyReply) => {
    const user = await this.authService.registerUser(req.body);
    reply.status(201).send(user);
  };

  public login = async (req: FastifyRequest<{ Body: LoginRequestDto }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    const data = await this.authService.loginUser({ email, password });

    reply.status(200).send(data);
  };

  public updateUserTier = async (req: FastifyRequest<{ Body: UpdateUserTierRequestDto }>, reply: FastifyReply) => {
    const { user } = req;
    const { tier } = req.body;

    const data = await this.authService.updateUserTier(user, tier);

    reply.status(200).send(data);
  };
}

export default AuthController;
