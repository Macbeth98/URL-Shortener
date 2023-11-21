import mongoose from 'mongoose';
import { errorContainer } from '@/exceptions/error.container';
import {
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResetPasswordResponseDto
} from './dtos/auth.dto';
import UserService from '../user/user.service';
import {
  AuthProvider,
  IAuthLoginResponse,
  IAuthProvider,
  IAuthRegisterResponse,
  IAuthUser
} from './interfaces/auth.interface';
import { UserTier } from '@/utils/enum.type';

class AuthService {
  private authProvider: AuthProvider;

  private userService: UserService;

  constructor(authProvider: IAuthProvider, userService: UserService) {
    this.authProvider = authProvider;
    this.userService = userService;
  }

  public async registerUser(userData: RegisterRequestDto): Promise<RegisterResponseDto> {
    const session = await mongoose.startSession();

    session.startTransaction();

    userData.displayUsername = userData.username;

    const user = await this.userService.createUser(userData, session);

    userData._id = user._id;

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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        displayUsername: user.displayUsername,
        createdAt: user.createdAt.toISOString()
      },
      message: authProviderResponse.message,
      codeDeliveryDetails: authProviderResponse.codeDeliveryDetails
    };
  }

  public async resendConfirmation(email: string): Promise<RegisterResponseDto> {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    const authResponse = await this.authProvider.resendConfirmation(email);

    return {
      status: 'OK',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        createdAt: user.createdAt.toISOString()
      },
      message: authResponse.message,
      codeDeliveryDetails: authResponse.codeDeliveryDetails
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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        createdAt: user.createdAt.toISOString()
      },
      tokenExpiresIn: authResponse.tokenExpiresIn,
      idToken: authResponse.idToken,
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken
    };
  }

  public async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    const response = await this.authProvider.forgotPassword(email);

    return {
      status: 'OK',
      message: response.message,
      codeDeliveryDetails: response.codeDeliveryDetails
    };
  }

  public async resetPassword(
    email: string,
    verificationCode: string,
    newPassword: string
  ): Promise<ResetPasswordResponseDto> {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw errorContainer.httpErrors.notFound('User not found');
    }

    const response = await this.authProvider.resetPassword(email, verificationCode, newPassword);

    return {
      status: 'OK',
      message: response.message
    };
  }

  public async jwtSecret(): Promise<string> {
    return this.authProvider.jwtSecret();
  }

  public async verifyJwtToken(token: string): Promise<IAuthUser> {
    return this.authProvider.verifyJwtToken(token);
  }

  public async updateUserTier(authUser: IAuthUser, tier: UserTier): Promise<RegisterResponseDto['user']> {
    const { email, authId } = authUser;

    if (tier === authUser.tier) {
      throw errorContainer.httpErrors.badRequest('User tier is already the same');
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await this.userService.updateUser(email, { tier }, session);

    let authProviderResponse: boolean;

    try {
      authProviderResponse = await this.authProvider.updateUserAttributes(authId, { tier });

      if (!authProviderResponse) {
        throw errorContainer.httpErrors.internalServerError('Failed to update user tier');
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      tier: user.tier,
      createdAt: user.createdAt.toISOString()
    };
  }
}

export default AuthService;
