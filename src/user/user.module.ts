import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RevokedTokenEntity } from './entities/revoked-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RevokedTokenEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
