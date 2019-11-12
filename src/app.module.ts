import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemModule } from './items/item.module';

let db;
if (process.env.NODE_ENV === 'test') {
  db = 'mongodb://localhost:27017/marecotest';
} else {
  db = 'mongodb://localhost:27017/mareco';
}

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ItemModule,
    MongooseModule.forRoot(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
