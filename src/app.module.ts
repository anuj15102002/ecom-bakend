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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';


dotenv.config();

config()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 10,
      limit: 3,
    }]),
    TypeOrmModule.forRootAsync({
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
    }),
    UserModule, CategoriesModule, ProductsModule, ReviewsModule,
    
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    
  ],
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
      .forRoutes('*')
  }
}
