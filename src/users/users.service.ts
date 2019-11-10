import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  NotAcceptableException,
  HttpStatus,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './interfaces/transaction.interface';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { TransferDto } from './dto/transfer.dto';
import { HttpExceptionFilter } from 'src/middleware/filter/http-exception.filter';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Transaction') private transaction: Model<Transaction>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
   
      const user = await this.userModel.findOne({ email: createUserDto.email });
      if (user){
        throw new HttpException(
          {
            data:{
              message: "Input data validation failed",
              errors: {
                  email: "email sudah terdaftar",
              }
            }
          },
          HttpStatus.BAD_REQUEST,
        )
      } 
      let createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOneByEmail(email): Model<User> {
    return await this.userModel.findOne({ email: email });
  }
  async findAll(): Model<User> {
    return await this.userModel.find();
  }

  async transfer(data: TransferDto, user: any): Model<User> {
    const session = await this.userModel.startSession();
    session.startTransaction();
    try {
      const sender = await this.userModel
        .findOne({ email: user.email })
        .session(session);
      
      const opts = { session };

      sender.balance = sender.balance - data.amount;
      if (sender.balance < data.amount) {
        throw new NotAcceptableException();
      }
      await sender.save();
      const receiver = await this.userModel
        .findOne({
          email: data.to,
        })
        .session(session);
      receiver.balance = receiver.balance + data.amount;
      await receiver.save();
      await this.transaction({
        date: Date.now(),
        to: data.to,
        total: data.amount,
        from: user.email,
      }).save(opts);

      await session.commitTransaction();
      return sender;
    } catch (error) {
      await session.abortTransaction();
      throw new NotAcceptableException();
    } finally {
      session.endSession();
    }
  }
}
