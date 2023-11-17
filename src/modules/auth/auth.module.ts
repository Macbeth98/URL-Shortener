import { ServiceContainer } from '../containers/service.container';
import UserService from '../user/user.service';
import AuthService from './auth.service';
// import { BasicAuthProvider } from './authProviders/basic.provider';
import { CognitoAuthProvider } from './authProviders/cognito.provider';

export class AuthModule {
  public authService: AuthService;

  public static jwtSecret = CognitoAuthProvider.jwtSecret;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  static async register(userService: UserService, serviceContainer: ServiceContainer) {
    const authService = new AuthService(new CognitoAuthProvider(serviceContainer), userService);
    return new AuthModule(authService);
  }
}
