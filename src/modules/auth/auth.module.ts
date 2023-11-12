import UserService from '../user/user.service';
import AuthService from './auth.service';
import { CognitoAuthProvider } from './authProviders/cognito.provider';

export class AuthModule {
  public authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  static async register(userService: UserService) {
    const authService = new AuthService(new CognitoAuthProvider(), userService);
    return new AuthModule(authService);
  }
}
