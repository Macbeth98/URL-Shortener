import mongoose from 'mongoose';
import { IUrlCounter } from './interfaces/counter.interface';

export class UrlCounter implements IUrlCounter {
  private db: mongoose.mongo.Db;

  private count: number;

  private counterId: mongoose.Types.ObjectId;

  constructor(count: number, db: mongoose.mongo.Db) {
    this.count = count;
    this.db = db;
  }

  private async init() {
    const counterDoc = await this.db.collection('counters').insertOne({ count: this.count });
    this.counterId = counterDoc.insertedId;
  }

  private async increment() {
    const counterDoc = await this.db
      .collection('counters')
      .findOneAndUpdate({ _id: this.counterId }, { $inc: { count: 1 } }, { returnDocument: 'after' });
    this.count += counterDoc.value.count;
  }

  public async getCounterValue(): Promise<number> {
    await this.increment();
    return this.count;
  }
}
