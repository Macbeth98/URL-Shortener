import { IUrl } from './url.interface';

export interface IUrlDAO {
  createUrl(url: IUrl): Promise<IUrl>;
  getUrl(shortUrl: string): Promise<IUrl | null>;
  getUrlsByUserId(userId: string): Promise<IUrl[]>;
  getUrls(filter: Partial<IUrl>, skip: number, limit: number): Promise<IUrl[]>;
  updateClicks(shortUrl: string): Promise<IUrl | null>;
}
