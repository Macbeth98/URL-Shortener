import { IUserDAO } from './daos/IUserDAO';
import { MongoUserDAO } from './daos/mongo-user.dao';
import UserService from './user.service';

export class UserModule {
  public userService: UserService;

  public userDao: IUserDAO;

  constructor(userService: UserService, userDao: IUserDAO) {
    this.userService = userService;
    this.userDao = userDao;
  }

  public static async register() {
    const userDao = new MongoUserDAO();
    const userService = new UserService(userDao);
    return new UserModule(userService, userDao);
  }
}
