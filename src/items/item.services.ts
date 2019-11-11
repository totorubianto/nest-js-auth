import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<any[]> {
    const data = await this.itemModel.find().populate('user', '-balance');
    return data;
  }

  async findOne(id: string): Promise<Item> {
    try {
      const item = await this.itemModel
        .findOne({ _id: id })
        .populate('user', '-balance');
      if (!item)
        throw new HttpException(
          {
            data: {
              message: 'Input data failed',
              errors: {
                id: 'tidak ditemukan barang',
              },
            },
          },
          HttpStatus.NOT_FOUND,
        );
      return item;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async create(item: Item, data): Promise<Item> {
    let itemData = item;
    itemData.user = data._id;
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async delete(id: string, user: any): Promise<Item> {
    try {
      const deleteData = await this.itemModel.findOneAndRemove({
        _id: id,
        user: user._id,
      });
      if (!deleteData)
        throw new HttpException(
          {
            data: {
              message: 'Input data failed',
              errors: {
                id: 'tidak ditemukan barang di koleksi anda',
              },
            },
          },
          HttpStatus.NOT_FOUND,
        );
      return deleteData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, item: Item, data: any): Promise<Item> {
    try {
      const itemData = await this.itemModel.findOne({ user: data._id });
      if (!itemData)
        throw new HttpException(
          {
            data: {
              message: 'Anda tidak dapat mengedit punya orang lain',
              errors: {
                item: 'Barang ini bukan milik anda',
              },
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
