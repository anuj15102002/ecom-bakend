import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserSignInDto } from "./user-singin.dto";

export class UserSignUpDTO extends UserSignInDto{

    @IsNotEmpty({message: 'Name is Required'})
    @IsString()
    name:string;
    

    

}