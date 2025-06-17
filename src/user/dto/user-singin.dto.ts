import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {

    @IsNotEmpty({message: 'Email is Required'})
    @IsEmail()
    email:string;

    @IsNotEmpty({message: 'Passoword is Required'})
    @MinLength(6, {message: 'Passowrd must be of length 6'})
    password:string;

}