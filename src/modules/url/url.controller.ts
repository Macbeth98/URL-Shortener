import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUrlRequestDto, GetUrlQueryDto, ProcessUrlParamsDto } from './dtos/url.dto';
import { UrlService } from './url.service';

export class UrlController {
  public urlService: UrlService;

  constructor(urlService: UrlService) {
    this.urlService = urlService;
  }

  public createShortUrl = async (req: FastifyRequest<{ Body: CreateUrlRequestDto }>, reply: FastifyReply) => {
    const { body, user } = req;
    body.email = user.email;
    const url = await this.urlService.createShortUrl(body);

    return reply.code(201).send(url);
  };

  public getShortUrl = async (req: FastifyRequest<{ Querystring: GetUrlQueryDto }>) => {
    const { query, user } = req;

    query.email = user.email;

    const skip = query.skip ? Number(query.skip) : 0;
    const limit = query.limit ? Number(query.limit) : 50;

    delete query.skip;
    delete query.limit;

    const urls = await this.urlService.getShortUrl(query, skip, limit);
    return urls;
  };

  public getTierLimits = async () => {
    const tierLimits = this.urlService.getTierLimits();
    return tierLimits;
  };

  public processShortUrl = async (req: FastifyRequest<{ Params: ProcessUrlParamsDto }>, reply: FastifyReply) => {
    const { params } = req;
    const url = await this.urlService.processShortUrl(params.alias);
    return reply.redirect(url);
  };
}
