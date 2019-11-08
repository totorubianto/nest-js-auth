import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
  date: {
    type: String,
    unique: true,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});
