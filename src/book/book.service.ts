import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const existingBook = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new Error('ISBN already exists');
    }

    createBookDto.availableQuantity = createBookDto.totalQuantity;
    return await this.prisma.book.create({ data: createBookDto });
  }

  async findAll(userId: number, search: string = '') {
    const books = await this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
          { isbn: { contains: search } },
        ],
      },
    });

    const booksWithBorrowStatus = await Promise.all(
      books.map(async (book) => {
        const bookBorrowRecords = await this.prisma.borrowRecord.findFirst({
          where: { bookId: book.id, userId, returnedAt: null },
        });
        book.coverImage = `${process.env.BASE_URL}/${process.env.UPLOAD_DIR}/${book.coverImage}`;

        return {
          ...book,
          isBorrowed: !!bookBorrowRecords,
          borrowId: bookBorrowRecords?.id,
        };
      }),
    );

    return booksWithBorrowStatus;
  }

  async findOne(userId: number, id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return null;
    }

    book.coverImage = `${process.env.BASE_URL}/${process.env.UPLOAD_DIR}/${book.coverImage}`;

    const bookBorrowRecords = await this.prisma.borrowRecord.findFirst({
      where: { bookId: id, userId, returnedAt: null },
    });

    book['isBorrowed'] = !!bookBorrowRecords;
    if (bookBorrowRecords) {
      book['borrowId'] = bookBorrowRecords.id;
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    if (updateBookDto.isbn) {
      const existingBook = await this.prisma.book.findUnique({
        where: { isbn: updateBookDto.isbn },
      });

      if (existingBook && existingBook.id !== id) {
        throw new Error('ISBN already exists');
      }
    }

    return await this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: borrowBookDto.bookId },
    });

    if (book && book.availableQuantity - borrowBookDto.quantity >= 0) {
      await this.prisma.book.update({
        where: { id: borrowBookDto.bookId },
        data: {
          availableQuantity: {
            decrement: borrowBookDto.quantity,
          },
        },
      });

      return await this.prisma.borrowRecord.create({
        data: {
          userId: borrowBookDto.userId,
          bookId: borrowBookDto.bookId,
          quantity: borrowBookDto.quantity,
        },
      });
    }
  }

  async returnBook(borrowRecordId: number) {
    const record = await this.prisma.borrowRecord.findUnique({
      where: { id: borrowRecordId },
    });

    if (record) {
      await this.prisma.book.update({
        where: { id: record.bookId },
        data: {
          availableQuantity: {
            increment: record.quantity,
          },
        },
      });

      return await this.prisma.borrowRecord.update({
        where: { id: borrowRecordId },
        data: {
          returnedAt: new Date(),
        },
      });
    }
  }
}
