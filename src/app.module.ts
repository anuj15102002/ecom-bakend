import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { config } from 'dotenv';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { truncate } from 'fs';
import { CurrentUserMiddleware } from './utils/middlewares/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { UserController } from './user/user.controller';


dotenv.config();

config()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
    , TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
      })

    })
    , UserModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware)
    // .exclude({
    //   path: 'api/v1/user/signUp', method: RequestMethod.POST
    // },
    //   {
    //     path: 'api/v1/user/signUp', method: RequestMethod.POST

    //   })
      .forRoutes(UserController)
  }
}
