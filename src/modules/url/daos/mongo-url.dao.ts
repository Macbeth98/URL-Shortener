import { IUrlDAO } from '../interfaces/url-dao.interface';
import { IUrl } from '../interfaces/url.interface';
import { UrlModel } from '../modelSchemas/url.model';

export class MongoUrlDAO implements IUrlDAO {
  public async createUrl(url: IUrl): Promise<IUrl> {
    const urlDocument = await new UrlModel(url).save();
    return urlDocument;
  }

  public async getUrl(alias: string): Promise<IUrl | null> {
    const urlDocument = await UrlModel.findOne({ alias });
    return urlDocument;
  }

  public async getUrlsByUserId(userId: string): Promise<IUrl[]> {
    const urls = await UrlModel.find({ userId });
    return urls;
  }

  public async getUrls(filter: Partial<IUrl>, skip: number, limit: number): Promise<IUrl[]> {
    const urls = await UrlModel.find(filter).skip(skip).limit(limit);
    return urls;
  }

  public async updateClicks(alias: string): Promise<IUrl> {
    const updatedDoc = await UrlModel.findOneAndUpdate(
      { alias },
      { $inc: { clicks: 1 }, $set: { lastClicked: new Date() } },
      { new: true }
    );
    return updatedDoc;
  }

  public async getCreatedUrlCounts(filter: Partial<IUrl>, skip: number, limit: number): Promise<number> {
    const count = await UrlModel.countDocuments(filter).skip(skip).limit(limit);
    return count;
  }
}
