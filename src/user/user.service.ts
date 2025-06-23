import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDTO } from './dto/user-singup.dto';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-singin.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  signIn(userSignInDto: UserSignInDto) {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectRepository(UserEntity)private userRepository: Repository<UserEntity>,
   private readonly configService: ConfigService,
   ){}

  async userSignIn(userSignInDto: UserSignInDto): Promise<Partial<UserEntity>> {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.email', 'users.password', 'users.role'])
      .where('users.email= :email', { email: userSignInDto.email })
      .getOne();
    if (!userExists) throw new BadRequestException('User does not Exists.');
    const matchedPassword = await bcrypt.compare(userSignInDto.password,userExists.password)
    if(!matchedPassword)throw new BadRequestException('Bad Credentials');
    const { password, ...result } = userExists;
    return result;
  }

  async createUser(userSignUpDto: UserSignUpDTO): Promise<Partial<UserEntity>> {
    let userExists = await this.findUserByEmail(userSignUpDto.email);
    if(userExists)throw new BadRequestException('Email already exists.')
    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, 10);
    let user =  this.userRepository.create(userSignUpDto);
    const savedUser = await this.userRepository.save(user);
    const {password, ...result} = savedUser;


    return result;
  }

  async getAccessToken(user: Partial<UserEntity>):Promise<string>{
    const secret = this.configService.get('ACCESS_TOKEN_SECRET_KEY');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRY_TIME');
    const payload = { id: Number(user.id), email: user.email };
    console.log('Signing JWT with payload:', payload);
    const accessToken = sign(payload, secret, { expiresIn });
    console.log(accessToken);
    return accessToken;
    
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(query: {
    page: number;
    limit: number;
  }): Promise<{
    users: Partial<UserEntity>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = query;
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'name', 'email', 'role', 'createdDate', 'updatedDate'],
    });

    return { users, total, page, limit };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({id});
    if(!user)throw new BadRequestException(`No user with ${id} found`)
    return user;
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async signOut():Promise<{message: string}>{
    return {message: "SignOut successful."}
  }

  async findUserByEmail(email:string){
    return await this.userRepository.findOneBy({email});
  }
}
