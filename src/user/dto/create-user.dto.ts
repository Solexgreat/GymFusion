import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    phoneNumber: number;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsDate()
    @IsString()
    @IsNotEmpty()
    dateOfBirth: string;
}
