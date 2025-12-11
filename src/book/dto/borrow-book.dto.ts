import { IsInt, IsNotEmpty } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
