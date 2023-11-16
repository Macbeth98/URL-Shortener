import { IConfig } from '@/utils/validateEnv';

export abstract class AbstractAuthProvider {
  static async jwtSecret(config: IConfig) {
    return config.SECRET_KEY;
  }
}
