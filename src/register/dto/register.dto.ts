import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
