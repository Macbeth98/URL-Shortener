import { IUrl } from './url.interface';

export interface IUrlDAO {
  createUrl(url: IUrl): Promise<IUrl>;
  getUrl(alias: string): Promise<IUrl | null>;
  getUrlsByUserId(userId: string): Promise<IUrl[]>;
  getUrls(filter: Partial<IUrl>, skip: number, limit: number): Promise<IUrl[]>;
  updateClicks(alias: string): Promise<IUrl | null>;
  getCreatedUrlCounts(filter: Partial<IUrl>, skip: number, limit: number): Promise<number>;
}
