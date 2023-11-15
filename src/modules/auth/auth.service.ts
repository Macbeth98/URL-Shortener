import mongoose from 'mongoose';
import { errorContainer } from '@/exceptions/error.container';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from './dtos/auth.dto';
import UserService from '../user/user.service';
import { IAuthLoginResponse, IAuthProvider, IAuthRegisterResponse, IAuthUser } from './interfaces/auth.interface';
import { UserTier } from '@/utils/enum.type';

class AuthService {
  private authProvider: IAuthProvider;

  private userService: UserService;

  constructor(authProvider: IAuthProvider, userService: UserService) {
    this.authProvider = authProvider;
    this.userService = userService;
  }

  public async registerUser(userData: RegisterRequestDto): Promise<RegisterResponseDto> {
    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await this.userService.createUser(userData, session);

    let authProviderResponse: IAuthRegisterResponse;

    // Add Auth Provider here.
    try {
      authProviderResponse = await this.authProvider.register(userData, user.tier as UserTier);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }

    return {
      status: 'OK',
      user: { ...user, createdAt: user.createdAt.toISOString() },
      message: authProviderResponse.message,
      codeDeliveryDetails: authProviderResponse.codeDeliveryDetails
    };
  }

  public async loginUser(loginData: LoginRequestDto, clientIp?: string): Promise<LoginResponseDto> {
    const user = await this.userService.getUser({ email: loginData.email });

    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    // AuthPorvider login here.
    const authResponse: IAuthLoginResponse = await this.authProvider.login(loginData, clientIp);

    return {
      status: 'OK',
      message: authResponse.message,
      user: { ...user, createdAt: user.createdAt.toISOString() },
      tokenExpiresIn: authResponse.tokenExpiresIn,
      idToken: authResponse.idToken,
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken
    };
  }

  public async jwtSecret(): Promise<string> {
    return this.authProvider.jwtSecret();
  }

  public async verifyJwtToken(token: string): Promise<IAuthUser> {
    return this.authProvider.verifyJwtToken(token);
  }
}

export default AuthService;
