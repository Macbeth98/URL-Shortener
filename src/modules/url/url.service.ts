import { Schema } from 'mongoose';
import { errorContainer } from '@/exceptions/error.container';
import { CreateUrlRequestDto, GetUrlQueryDto } from './dtos/url.dto';
import { IUrlCounter } from './interfaces/counter.interface';
import { serviceContainer } from '../containers/service.container';
import { IUrlDAO } from './interfaces/url-dao.interface';
import { IUrl } from './interfaces/url.interface';
import UserService from '../user/user.service';

export class UrlService {
  private httpErrors = errorContainer.httpErrors;

  private config = serviceContainer.config;

  private shortUrl: string;

  private urlCounter: IUrlCounter;

  private urlDao: IUrlDAO;

  private userService: UserService;

  constructor(urlCounter: IUrlCounter, urlDao: IUrlDAO, userService: UserService) {
    this.urlCounter = urlCounter;
    this.shortUrl = this.config.SHORT_URL;
    this.urlDao = urlDao;
    this.userService = userService;
  }

  public async isValidUrl(url: string) {
    return URL.canParse(url);
  }

  private encodeToBase62(numToEncode: number) {
    const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let encoded = '';

    let num = numToEncode;

    while (num) {
      const remainder = num % 62;
      num = Math.floor(num / 62);
      encoded = base[remainder].toString() + encoded;
    }

    return encoded;
  }

  private async generateAlias() {
    const counterValue = await this.urlCounter.getCounterValue();
    const alias = this.encodeToBase62(counterValue);
    return alias;
  }

  public async createShortUrl(createUrlDto: CreateUrlRequestDto) {
    const { url, customAlias } = createUrlDto;

    if (!this.isValidUrl(url)) {
      throw this.httpErrors.badRequest('Invalid URL');
    }

    const user = await this.userService.getUser({ email: createUrlDto.email });

    if (!user) {
      throw this.httpErrors.notFound('User not found');
    }

    let alias: string;
    let setCustomAlias = false;

    if (customAlias) {
      const urlDocument = await this.urlDao.getUrl(customAlias);
      if (urlDocument) {
        throw this.httpErrors.conflict('Alias already exists');
      }
      alias = customAlias;
      setCustomAlias = true;
    } else {
      // Create the short URL alias

      alias = await this.generateAlias();
    }

    const shortUrl = `${this.shortUrl}/${alias}`;

    const urlDoc: IUrl = {
      alias,
      shortUrl,
      url,
      userId: user._id,
      customAlias: setCustomAlias,
      clicks: 0
    };

    // save to the Database
    const urlDocument = await this.urlDao.createUrl(urlDoc);

    return urlDocument;
  }

  public async getShortUrl(query: GetUrlQueryDto, skip: number, limit: number) {
    const { email } = query;
    if (email) {
      const user = await this.userService.getUser({ email });
      if (!user) {
        throw this.httpErrors.notFound('User not found');
      }
      if (user._id instanceof Schema.Types.ObjectId || typeof user._id === 'string') {
        query.userId = user._id;
      }
      delete query.email;
    }

    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 50;
    }

    const urls = await this.urlDao.getUrls(query, skip, limit);

    return urls;
  }

  public async processShortUrl(alias: string) {
    const urlDocument = await this.urlDao.getUrl(alias);
    return urlDocument.url;
  }

  public async getCreatedUrlCounts(filter: Partial<IUrl>, skip: number, limit: number) {
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 50;
    }
    const counts = await this.urlDao.getCreatedUrlCounts(filter, skip, limit);
    return counts;
  }

  public async incrementClicks(alias: string) {
    const urlDocument = await this.urlDao.updateClicks(alias);
    return urlDocument;
  }
}
