import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
export const AuthSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
});
