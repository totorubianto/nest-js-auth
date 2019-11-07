import * as mongoose from 'mongoose';

export const ItemSchema = new mongoose.Schema({
  item: String,
  description: String,
});
