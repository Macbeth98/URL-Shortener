import { IConfig } from '@/utils/validateEnv';
import { ServiceContainer } from '../containers/service.container';
import UserService from '../user/user.service';
import AuthService from './auth.service';
import { BasicAuthProvider } from './authProviders/basic.provider';
import { CognitoAuthProvider } from './authProviders/cognito.provider';
import { IAuthProvider } from './interfaces/auth.interface';

export class AuthModule {
  public authService: AuthService;

  public static jwtSecret = (config: IConfig) => {
    if (config.NODE_ENV !== 'production') {
      return BasicAuthProvider.jwtSecret;
    }
    return CognitoAuthProvider.jwtSecret;
  };

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  static async register(userService: UserService, serviceContainer: ServiceContainer, config: IConfig) {
    let authProvider: IAuthProvider;
    if (config.NODE_ENV !== 'production') {
      authProvider = new BasicAuthProvider(serviceContainer);
    } else {
      authProvider = new CognitoAuthProvider(serviceContainer);
    }
    const authService = new AuthService(authProvider, userService);
    return new AuthModule(authService);
  }
}
