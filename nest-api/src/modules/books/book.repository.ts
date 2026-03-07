import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteImage, saveImage } from 'src/utils/image';
import { DataSource, Repository } from 'typeorm';
import { AuthorEntity } from '../authors/author.entity';
import {
    BookModel,
    BookTypeModel,
    CreateBookModel,
    CreateBookTypeModel,
    CreateGenreModel,
    FilterBooksModel,
    GenreModel,
    UpdateBookModel,
} from './book.model';
import { BookEntity, BookId } from './entities/book.entity';
import { BookTypeEntity } from './entities/booktype.entity';
import { GenreEntity } from './entities/genre.entity';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(BookTypeEntity)
    private readonly bookTypeRepository: Repository<BookTypeEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async getAllBooks(
    input?: FilterBooksModel,
  ): Promise<[BookModel[], number]> {
    const sortField = input?.sort?.field ?? 'title';
    const sortDirection = input?.sort?.direction ?? 'ASC';

    const order =
      sortField === 'authorName'
        ? {
            author: {
              lastName: sortDirection,
              firstName: sortDirection,
            },
            title: 'ASC' as const,
          }
        : {
            [sortField]: sortDirection,
            ...(sortField !== 'title' && {
              title: 'ASC' as const,
            }),
          };

    const where = input?.genreId
      ? { genre: { id: input.genreId } }
      : undefined;

    const [books, totalCount] = await this.bookRepository.findAndCount({
      where,
      take: input?.limit,
      skip: input?.offset,
      relations: { author: true, bookType: true, genre: true },
      order,
    });

    return [books, totalCount];
  }

  public async getBookById(id: BookId): Promise<BookModel | undefined> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { author: true, bookType: true, genre: true },
    });

    if (!book) {
      return undefined;
    }

    return book;
  }

  public async createBook(book: CreateBookModel): Promise<BookModel> {
    const author = await this.authorRepository.findOne({
      where: { id: book.authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    if (book.bookTypeId) {
      const bookType = await this.bookTypeRepository.findOne({
        where: { id: book.bookTypeId },
      });
      if (!bookType) {
        throw new Error('Book type not found');
      }
    }

    if (book.genreId) {
      const genre = await this.genreRepository.findOne({
        where: { id: book.genreId },
      });
      if (!genre) {
        throw new Error('Genre not found');
      }
    }

    const { coverImage, ...newBook } = book;

    const createdBook = await this.bookRepository.save(
      this.bookRepository.create(newBook),
    );

    if (!coverImage) {
      return {
        ...createdBook,
        author,
      };
    }

    const coverPath = saveImage(coverImage, 'books', createdBook.id);
    await this.bookRepository.update(createdBook.id, { coverPath });

    return {
      ...createdBook,
      author,
      coverPath,
    };
  }

  public async updateBook(
    id: BookId,
    book: UpdateBookModel,
  ): Promise<BookModel | undefined> {
    const oldBook = await this.bookRepository.findOne({
      where: { id },
    });

    if (!oldBook) {
      return undefined;
    }

    const { coverImage, ...updates } = book;

    let coverPath: string | undefined = oldBook.coverPath;
    if (coverImage) {
      coverPath = saveImage(coverImage, 'books', oldBook.id);
    }

    await this.bookRepository.update(id, { ...updates, coverPath });

    return this.getBookById(id);
  }

  public async deleteBook(id: BookId): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    if (result.affected && result.affected > 0) {
      deleteImage('books', id);
      return true;
    }

    return false;
  }

  public async deleteBooks(ids: BookId[]): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await Promise.all(
        ids.map((id) => transactionalEntityManager.delete(BookEntity, { id })),
      );
    });

    ids.forEach((id) => deleteImage('books', id));
  }

  public async getBookTypes(): Promise<BookTypeModel[]> {
    return this.bookTypeRepository.find({ order: { name: 'ASC' } });
  }

  public async getGenres(): Promise<GenreModel[]> {
    return this.genreRepository.find({ order: { name: 'ASC' } });
  }

  public async getBookTypeByName(name: string): Promise<BookTypeModel | null> {
    return this.bookTypeRepository.findOne({ where: { name } });
  }

  public async getGenreByName(name: string): Promise<GenreModel | null> {
    return this.genreRepository.findOne({ where: { name } });
  }

  public async createBookType(
    input: CreateBookTypeModel,
  ): Promise<BookTypeModel> {
    const created = this.bookTypeRepository.create({ name: input.name.trim() });
    return this.bookTypeRepository.save(created);
  }

  public async createGenre(input: CreateGenreModel): Promise<GenreModel> {
    const created = this.genreRepository.create({ name: input.name.trim() });
    return this.genreRepository.save(created);
  }
}
