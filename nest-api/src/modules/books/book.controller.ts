import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { parseListQueryParams } from '../../utils/list-query';
import { BookMetadataService } from './book-metadata.service';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './book.dto';
import { BookSortField, GetBooksModel } from './book.model';
import { BookService } from './book.service';
import { BookId } from './entities/book.entity';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookMetadataService: BookMetadataService,
  ) {}

  @Get()
  async getBooks(@Query() input: GetBooksDto): Promise<GetBooksModel> {
    const params = parseListQueryParams<BookSortField>(input, {
      defaultSortField: 'title',
      defaultSortDirection: 'ASC',
      defaultOffset: 0,
      minLimit: 1,
      maxLimit: 100,
    });

    const [books, totalCount] = await this.bookService.getAllBooks({
      ...params,
      genreId: input.genreId,
    });

    return {
      data: books,
      totalCount,
    };
  }

  @Get('types')
  public async getBookTypes() {
    return this.bookMetadataService.getBookTypes();
  }

  @Get('genres')
  public async getGenres() {
    return this.bookMetadataService.getGenres();
  }

  @Get(':id')
  public async getBook(@Param('id') id: string) {
    return this.bookService.getBookById(id as BookId);
  }

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id as BookId, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id as BookId);
  }
}
