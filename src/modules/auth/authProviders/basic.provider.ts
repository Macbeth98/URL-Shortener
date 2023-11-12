import { compare, hash } from 'bcrypt';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import {
  IAttribute,
  IAuthForgotPasswordResponse,
  IAuthLoginResponse,
  IAuthProvider,
  IAuthRegisterResponse,
  IAuthResetPasswordResponse
} from './IAuthProvider';
import { serviceContainer } from '@/modules/containers/service.container';

export class BasicAuthProvider implements IAuthProvider {
  private saltRounds = 10;

  private db = serviceContainer.fastify.mongo;

  private httpErrors = serviceContainer.httpErrors;

  private fastify = serviceContainer.fastify;

  public async register(signupUserDto: RegisterRequestDto): Promise<IAuthRegisterResponse> {
    const { email, password, tier } = signupUserDto;
    const hashedPassword = await hash(password, this.saltRounds);

    await this.db.collection('auth').insertOne({ email, password: hashedPassword, tier });

    return {
      status: true,
      message: 'User registered successfully',
      codeDeliveryDetails: await this.sendEmailVerification(email)
    };
  }

  public async resendConfirmation(email: string): Promise<IAuthRegisterResponse> {
    return {
      status: true,
      message: 'User registered successfully',
      codeDeliveryDetails: await this.sendEmailVerification(email)
    };
  }

  public async login(loginRequestDto: LoginRequestDto): Promise<IAuthLoginResponse> {
    const { email, password } = loginRequestDto;

    const user = (await this.db.collection('auth').findOne({ email })) as unknown as {
      email: string;
      password: string;
      tier: string;
    };

    if (!user) {
      throw this.httpErrors.notFound('User not found');
    }
    // compare hashed and password
    const isPasswordMatching: boolean = await compare(password, user.password).catch(() => false);

    if (!isPasswordMatching) {
      throw this.httpErrors.unauthorized('Invalid password');
    }

    const payload = {
      email: user.email,
      tier: user.tier
    };

    const idToken = this.fastify.jwt.sign(payload, { expiresIn: '60m' });

    const refreshToken = this.fastify.jwt.sign(payload, { expiresIn: '30d' });

    return {
      status: true,
      message: 'User login successfully',
      tokenExpiresIn: 60 * 60,
      idToken,
      accessToken: idToken,
      refreshToken
    };
  }

  public async forgotPassword(email: string): Promise<IAuthForgotPasswordResponse> {
    const user = await this.db.collection('auth').findOne({ email });

    if (!user) {
      throw this.httpErrors.notFound('User not found');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.db
      .collection('auth')
      .updateOne({ email }, { $set: { resetCode, expireResetCodeBy: Date.now() + 10 * 60 } });

    return {
      status: true,
      message: 'User registered successfully',
      codeDeliveryDetails: await this.sendResetPasswordEmail(email, resetCode)
    };
  }

  public async resetPassword(email: string, code: string, newPassword: string): Promise<IAuthResetPasswordResponse> {
    const user = await this.db.collection('auth').findOne({ email });
    if (!user) {
      throw this.httpErrors.notFound('User not found');
    }

    if (user.resetCode !== code) {
      throw this.httpErrors.unauthorized('Invalid reset code');
    }

    if (user.expireResetCodeBy < Date.now()) {
      throw this.httpErrors.unauthorized('Reset code expired');
    }

    const hashedPassword = await hash(newPassword, this.saltRounds);

    await this.db
      .collection('auth')
      .updateOne({ email }, { $set: { password: hashedPassword }, $unset: { resetCode: 1, expireResetCodeBy: 1 } });

    return {
      status: true,
      message: 'Password reset successfully'
    };
  }

  public async updateUserAttributes(email: string, attributes: IAttribute): Promise<boolean> {
    await this.db.collection('auth').updateOne({ email }, { $set: attributes });
    return true;
  }

  public async deleteUser(email: string): Promise<boolean> {
    await this.db.collection('auth').deleteOne({ email });
    return true;
  }

  private async sendEmailVerification(email: string) {
    // send email verification
    return {
      AttributeName: 'email',
      DeliveryMedium: 'EMAIL',
      Destination: email
    };
  }

  private async sendResetPasswordEmail(email: string, code: string) {
    this.fastify.log.info(`Reset password code: ${code}`);
    // send email verification
    return {
      AttributeName: 'email',
      DeliveryMedium: 'EMAIL',
      Destination: email
    };
  }
}
