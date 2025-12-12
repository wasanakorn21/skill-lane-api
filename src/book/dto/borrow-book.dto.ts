import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
