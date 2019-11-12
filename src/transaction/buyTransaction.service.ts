import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './interfaces/transaction.interface';

@Injectable()
export class BuyService {
  constructor(@InjectModel('Buy') private buyTransactionModel: Model<any>) {}

  async findAll(): Model<Transaction> {
    return [
      {
        _id: 12312312,
        name: 'asdas',
      },
      {
        _id: 12312312,
        name: 'asdas',
      },
    ];
  }

  async create(data: any): Model<Transaction> {
    console.log(data);
  }
}
