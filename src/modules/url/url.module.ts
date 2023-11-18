import mongoose from 'mongoose';
import { IUrlCounter } from './interfaces/counter.interface';
import { IUrlDAO } from './interfaces/url-dao.interface';
import { UrlCounter } from './url.counter';
import { UrlService } from './url.service';
import { MongoUrlDAO } from './daos/mongo-url.dao';
import UserService from '../user/user.service';
import { ICache } from '@/cache/cache.interface';

export class UrlModule {
  public urlService: UrlService;

  private urlDao: IUrlDAO;

  private urlCounter: IUrlCounter;

  constructor(
    urlService?: UrlService,
    urlDao?: IUrlDAO,
    urlCounter?: IUrlCounter,
    userService?: UserService,
    urlCache?: ICache
  ) {
    if (urlService) {
      // Handling the case where a UrlService is provided
      this.urlService = urlService;
    } else if (urlDao && urlCounter && userService) {
      // Handling the case where UrlDAO and other dependencies are provided
      this.urlDao = urlDao;
      this.urlCounter = urlCounter as IUrlCounter;
      this.urlService = new UrlService(this.urlCounter, this.urlDao, userService, urlCache);
    } else {
      throw new Error('UrlModule requires either a UrlService or UrlDAO and other dependencies');
    }
  }

  public static async register(
    initialUrlCounter: number,
    db: mongoose.mongo.Db,
    userService: UserService,
    urlCache: ICache
  ) {
    const urlCounter = new UrlCounter(initialUrlCounter, db);
    const urlDao = new MongoUrlDAO();
    const urlService = new UrlService(urlCounter, urlDao, userService, urlCache);
    return new UrlModule(urlService);
  }
}
