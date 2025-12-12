import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  published: string;

  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  totalQuantity: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  availableQuantity: number = 0;
}
