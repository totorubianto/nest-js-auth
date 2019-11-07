import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
