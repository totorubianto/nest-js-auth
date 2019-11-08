import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schema/user.schema';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { TransactionSchema } from './schema/transaction.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes(UsersController);
  // }
}
