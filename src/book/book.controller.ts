import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookService } from './book.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('upload')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = process.env.UPLOAD_DIR || 'uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/${process.env.UPLOAD_DIR}/${file.filename}`,
      filename: file.filename,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: any, @Query('search') search: string) {
    return await this.bookService.findAll(user.userId, search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.bookService.findOne(user.userId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.update(id, updateBookDto);
  }

  @Post('borrow')
  @UseGuards(JwtAuthGuard)
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return await this.bookService.borrowBook(borrowBookDto);
  }

  @Post(':id/return')
  @UseGuards(JwtAuthGuard)
  async returnBook(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.returnBook(id);
  }
}
