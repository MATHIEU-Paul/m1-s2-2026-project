import { ListQueryModel } from '../../utils/list-query';
import { AuthorId } from '../authors/author.entity';
import { AuthorModel } from '../authors/author.model';
import { BookPurchaseDetailsModel } from '../purchases/purchase.model';
import { BookId } from './entities/book.entity';
import { BookTypeId } from './entities/booktype.entity';
import { GenreId } from './entities/genre.entity';

export type BookTypeModel = {
  id: BookTypeId;
  name: string;
};

export type GenreModel = {
  id: GenreId;
  name: string;
};

export type BookModel = {
  id: BookId;
  title: string;
  yearPublished: number;
  numberPages?: number;
  coverPath?: string | null;
  author: AuthorModel;
  bookType?: BookTypeModel;
  genre?: GenreModel;
};

export type BookDetailsModel = BookModel & {
  purchases: BookPurchaseDetailsModel[];
};

export type BookWithPurchaseCountModel = BookModel & {
  purchaseCount: number;
};

export type CreateBookModel = {
  title: string;
  yearPublished: number;
  numberPages?: number;
  coverImage?: string;
  authorId: AuthorId;
  bookTypeId?: BookTypeId;
  genreId?: GenreId;
};

export type CreateBookTypeModel = {
  name: string;
};

export type CreateGenreModel = {
  name: string;
};

export type UpdateBookModel = Partial<Omit<CreateBookModel, 'coverImage'>> & {
  coverImage?: string | null;
};

export type BookSortField = keyof BookModel | 'authorName';

export type FilterBooksModel = ListQueryModel<BookSortField> & {
  genreId?: GenreId;
};

export type GetBooksModel = {
  totalCount: number;
  data: BookWithPurchaseCountModel[];
};
