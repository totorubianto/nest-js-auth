import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { _ } from 'lodash';
@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<any[]> {
    const data = await this.itemModel.find().populate('user');

    // let hash = Object.create(null);

    // let result = data.map(
    //   (hash => item =>
    //     (hash[item.user] = {
    //       _id: item._id,
    //       item: item.item,
    //       description: item.description,
    //       user: item.user,
    //       users: {},
    //     }))(hash),
    // );
    // data.map(itemLoop => {
    //   user.forEach(
    //     (hash => user => {
    //       if (_.findKey(data, { user: user._id })) {
    //         hash[user._id].users = {
    //           _id: user._id,
    //           email: user.email,
    //           role: user.role,
    //         };
    //       }
    //     })(hash),
    //   );
    // });

    return data;
  }

  async findOne(id: string): Promise<Item> {
    try {
      return await this.itemModel.findOne({ _id: id });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async create(item: Item, data): Promise<Item> {
    let itemData = item;
    itemData.user = data;
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async delete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndRemove(id);
  }

  async update(id: string, item: Item, data: any): Promise<Item> {
    try {
      const user = await this.itemModel.findOne({ _id: id });
      if (!user) throw new UnauthorizedException();
      return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
