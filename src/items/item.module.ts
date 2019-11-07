import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { ItemService } from './item.services';
import { ItemSchema } from './schemas/item.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
