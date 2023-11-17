import { FastifyReply, FastifyRequest } from 'fastify';

import AuthService from '@modules/auth/auth.service';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  UpdateUserTierRequestDto
} from './dtos/auth.dto';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public signup = async (req: FastifyRequest<{ Body: RegisterRequestDto }>, reply: FastifyReply) => {
    const user = await this.authService.registerUser(req.body);
    return reply.status(201).send(user);
  };

  public resendConfirmation = async (req: FastifyRequest<{ Body: { email: string } }>) => {
    const { email } = req.body;

    const data = await this.authService.resendConfirmation(email);

    return data;
  };

  public login = async (req: FastifyRequest<{ Body: LoginRequestDto }>) => {
    const { email, password } = req.body;

    const data = await this.authService.loginUser({ email, password });

    return data;
  };

  public forgotPassword = async (req: FastifyRequest<{ Body: { email: string } }>) => {
    const { email } = req.body;

    const data = await this.authService.forgotPassword(email);

    return data;
  };

  public resetPassword = async (req: FastifyRequest<{ Body: ResetPasswordRequestDto }>) => {
    const { email, verificationCode, newPassword } = req.body;

    const data = await this.authService.resetPassword(email, verificationCode, newPassword);

    return data;
  };

  public updateUserTier = async (req: FastifyRequest<{ Body: UpdateUserTierRequestDto }>) => {
    const { user } = req;
    const { tier } = req.body;

    const data = await this.authService.updateUserTier(user, tier);

    return data;
  };
}

export default AuthController;
