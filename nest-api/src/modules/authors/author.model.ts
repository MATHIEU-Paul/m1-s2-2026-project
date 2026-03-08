import { ListQueryModel } from '../../utils/list-query';
import { AuthorId } from './author.entity';

export type AuthorModel = {
  id: AuthorId;
  firstName: string;
  lastName: string;
  imagePath?: string | null;
};

export type AuthorBookModel = {
  id: string;
  title: string;
  coverPath?: string | null;
};

export type AuthorDetailsModel = AuthorModel & {
  books: AuthorBookModel[];
  purchasesAverage: number;
};

export type AuthorWithBookCountModel = AuthorModel & {
  bookCount: number;
};

export type CreateAuthorModel = {
  firstName: string;
  lastName: string;
  image?: string;
};

export type UpdateAuthorModel = Partial<Omit<CreateAuthorModel, 'image'>> & {
  image?: string | null;
};

export type AuthorSortField = keyof AuthorModel;

export type FilterAuthorsModel = ListQueryModel<AuthorSortField>;

export type GetAuthorsModel = {
  totalCount: number;
  data: AuthorWithBookCountModel[];
};
