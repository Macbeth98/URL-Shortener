import { IUrlDAO } from '../interfaces/url-dao.interface';
import { IUrl } from '../interfaces/url.interface';
import { UrlModel } from '../modelSchemas/url.model';

export class MongoUrlDAO implements IUrlDAO {
  public async createUrl(url: IUrl): Promise<IUrl> {
    const urlDocument = await new UrlModel(url).save();
    return urlDocument;
  }

  public async getUrl(shortUrl: string): Promise<IUrl> {
    const urlDocument = await UrlModel.findOne({ shortUrl });
    return urlDocument;
  }

  getUrlsByUserId(userId: string): Promise<IUrl[]> {
    const urls = UrlModel.find({ userId });
    return urls;
  }

  getUrls(filter: Partial<IUrl>, skip: number, limit: number): Promise<IUrl[]> {
    const urls = UrlModel.find(filter).skip(skip).limit(limit);
    return urls;
  }

  updateClicks(shortUrl: string): Promise<IUrl> {
    const updatedDoc = UrlModel.findOneAndUpdate({ shortUrl }, { $inc: { clicks: 1 } }, { new: true });
    return updatedDoc;
  }
}
