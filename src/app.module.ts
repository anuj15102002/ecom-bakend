import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { config } from 'dotenv';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { truncate } from 'fs';
import { CurrentUserMiddleware } from './utils/common/middlewares/current-user.middleware';
import { REQUEST } from '@nestjs/core';
dotenv.config();

config()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
    ,TypeOrmModule.forRootAsync({
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
    , UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(CurrentUserMiddleware)
    .forRoutes({path: 'api/v1/user/(.*)', method: RequestMethod.ALL})
  }
 }
