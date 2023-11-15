import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import {
  IAttribute,
  IAuthForgotPasswordResponse,
  IAuthLoginResponse,
  IAuthProvider,
  IAuthRegisterResponse,
  IAuthResetPasswordResponse,
  IAuthUser
} from '../interfaces/auth.interface';
import { serviceContainer } from '@/modules/containers/service.container';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import { UserTier } from '@/utils/enum.type';

export class CognitoAuthProvider implements IAuthProvider {
  private userPool: CognitoUserPool;

  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

  private config = serviceContainer.config;

  private logger = serviceContainer.logger;

  private jwt = serviceContainer.jwt;

  private cognitoEndpoint: string;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.config.AWS_COGNITO_USER_POOL_ID,
      ClientId: this.config.AWS_COGNITO_CLIENT_ID
    });

    const authority = `https://cognito-idp.${this.config.AWS_REGION}.amazonaws.com/${this.config.AWS_COGNITO_USER_POOL_ID}`;

    this.cognitoEndpoint = `${authority}/.well-known/jwks.json`;

    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: this.config.AWS_REGION,
      endpoint: authority
    });
  }

  public async register(registerRequestDto: RegisterRequestDto, tier: UserTier): Promise<IAuthRegisterResponse> {
    const { email, password, username } = registerRequestDto;

    const dataEmail = {
      Name: 'email',
      Value: email
    };

    const preferredUsername = {
      Name: 'preferred_username',
      Value: username
    };

    const updatedAt = {
      Name: 'updated_at',
      Value: new Date().getTime().toString()
    };

    const customTier = {
      Name: 'custom:tier',
      Value: tier
    };

    const attributeList = [
      new CognitoUserAttribute(dataEmail),
      new CognitoUserAttribute(preferredUsername),
      new CognitoUserAttribute(updatedAt),
      new CognitoUserAttribute(customTier)
    ];

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, async (err, result) => {
        if (err || !result) {
          reject(err);
          return;
        }

        const response: IAuthRegisterResponse = {
          status: true,
          message: 'User successfully registered. Please check your email for verification code!',
          codeDeliveryDetails: result.codeDeliveryDetails
        };

        resolve(response);
      });
    });
  }

  public async resendConfirmation(email: string): Promise<IAuthRegisterResponse> {
    const user = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      user.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const response: IAuthRegisterResponse = {
          status: true,
          message: 'Verification code successfully resent. Please check your email!',
          codeDeliveryDetails: result.CodeDeliveryDetails
        };

        resolve(response);
      });
    });
  }

  public login(loginRequestDto: LoginRequestDto, clientIp: string): Promise<IAuthLoginResponse> {
    const { email, password } = loginRequestDto;

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.config.AWS_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      },
      UserContextData: {
        EncodedData: `Ip=${clientIp}`
      }
    };

    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.initiateAuth(params, async (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const response: IAuthLoginResponse = {
          status: true,
          message: 'Login successful',
          tokenExpiresIn: result.AuthenticationResult.ExpiresIn,
          accessToken: result.AuthenticationResult.AccessToken,
          idToken: result.AuthenticationResult.IdToken,
          refreshToken: result.AuthenticationResult.RefreshToken
        };

        resolve(response);
      });
    });
  }

  public forgotPassword(email: string): Promise<IAuthForgotPasswordResponse> {
    const userData = {
      Username: email,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess(result) {
          return resolve({
            status: true,
            message: 'Password reset code sent to your email',
            codeDeliveryDetails: result.codeDeliveryDetails
          });
        },
        onFailure(err) {
          return reject(err);
        },
        inputVerificationCode(data: { CodeDeliveryDetails: IAuthForgotPasswordResponse['codeDeliveryDetails'] }): void {
          return resolve({
            status: true,
            message: 'Password reset code sent to your email',
            codeDeliveryDetails: data.CodeDeliveryDetails
          });
        }
      });
    });
  }

  public resetPassword(email: string, code: string, newPassword: string): Promise<IAuthResetPasswordResponse> {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess() {
          return resolve({
            status: true,
            message: 'Password successfully reset'
          });
        },
        onFailure(err) {
          return reject(err);
        }
      });
    });
  }

  updateUserAttributes(email: string, attributes: IAttribute): Promise<boolean> {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    const attributeList: CognitoUserAttribute[] = [];

    Object.keys(attributes).forEach((key) => {
      attributeList.push(
        new CognitoUserAttribute({
          Name: key,
          Value: attributes[key]
        })
      );
    });

    return new Promise((resolve, reject) => {
      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        this.logger.info(result, 'CognitoAuthService.editUserAttributes');
        resolve(true);
      });
    });
  }

  deleteUser(email: string): Promise<boolean> {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      cognitoUser.deleteUser((err, result) => {
        if (err) {
          reject(err);
          return;
        }

        this.logger.info(result, 'CognitoAuthService.deleteUser');
        resolve(true);
      });
    });
  }

  public async jwtSecret(): Promise<string> {
    const cognitoData = await axios.get(this.cognitoEndpoint);
    const keys = cognitoData.data.keys[0];
    const pem = jwkToPem(keys);

    return pem;
  }

  public async verifyJwtToken(token: string): Promise<IAuthUser> {
    return new Promise((resolve, reject) => {
      this.jwt.verify(token, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }

        this.logger.info(decoded, 'CognitoAuthService.verifyJwtToken');

        resolve(decoded);
      });
    });
  }
}
