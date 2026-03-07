import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseService } from '../purchases/purchase.service';
import {
  BookDetailsModel,
  BookModel,
  BookWithPurchaseCountModel,
  CreateBookModel,
  FilterBooksModel,
  UpdateBookModel,
} from './book.model';
import { BookRepository } from './book.repository';
import { BookId } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly purchaseService: PurchaseService,
  ) {}

  public async getAllBooks(
    input?: FilterBooksModel,
  ): Promise<[BookWithPurchaseCountModel[], number]> {
    const [books, totalCount] = await this.bookRepository.getAllBooks(input);

    const purchaseCountsByBookId =
      await this.purchaseService.getPurchaseCountsByBookIds(
        books.map((book) => book.id),
      );

    const booksWithCount = books.map((book) => ({
      ...book,
      purchaseCount: purchaseCountsByBookId[book.id] ?? 0,
    }));

    return [booksWithCount, totalCount];
  }

  public async getBookById(id: BookId): Promise<BookDetailsModel> {
    const book = await this.bookRepository.getBookById(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    const purchases = await this.purchaseService.getPurchasesByBookId(id);

    return {
      ...book,
      purchases,
    };
  }

  public async createBook(book: CreateBookModel): Promise<BookModel> {
    return this.bookRepository.createBook(book);
  }

  public async updateBook(
    id: BookId,
    book: UpdateBookModel,
  ): Promise<BookModel> {
    const updatedBook = await this.bookRepository.updateBook(id, book);
    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return updatedBook;
  }

  public async deleteBook(id: BookId): Promise<void> {
    const deleted = await this.bookRepository.deleteBook(id);
    if (!deleted) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
  }
}
