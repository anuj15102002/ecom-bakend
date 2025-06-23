import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsPostalCode, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message: 'title cannot be empty'})
    @IsString({message:'title must be a string'})
    name:string;

    @IsNotEmpty({message: 'description cannot be empty'})
    @IsString({message: 'description must be a string'})
    description:string;

    @IsNotEmpty({message: 'price cannot be empty'})
    @IsNumber()
    @IsPositive({message: 'price cannot be a negative number'})
    price: number;

    @IsNotEmpty({message: 'stock cannot be empty'})
    @IsNumber({}, {message: 'stock must a number'})
    @IsPositive({message: 'stock must be a positive number'})
    stock: number;

    @IsNotEmpty({message: 'images cannot be null'})
    @IsArray({message: 'images must be in string format'})
    images: string[];

    @IsNotEmpty({message: 'category id cannot be emtpy'})
    @IsNumber({},{message: 'category id must be in number'})
    categoryId: number;
}
