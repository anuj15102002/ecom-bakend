import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDTO } from './dto/user-singup.dto';
import { UserSignInDto } from './dto/user-singin.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { AuthorizationGuard } from 'src/utils/gurads/authorization.guard';
import { request } from 'express';
import { AuthenticationGuard } from 'src/utils/gurads/authentication.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signIn')
  async singInUser(@Body()userSingInDto:UserSignInDto): Promise<{
    accessToken: string;
    user: Partial<UserEntity>;
}>{
    const user = await this.userService.userSignIn(userSingInDto);
    const accessToken = await this.userService.getAccessToken(user);
    return { accessToken, user };
  }

  @Post('signUp')
  async signUpUser(@Body() userSingUpDTO: UserSignUpDTO) : Promise<Partial<UserEntity>>{
    return await this.userService.createUser(userSingUpDTO);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Get('getAll')
  async findAll(): Promise<UserEntity[]> {
    console.log(request.currentUser)
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthorizationGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: Partial<UserEntity>):Partial<UserEntity>{
    console.log('current User is in controller')
    return currentUser;
    
  }
}
