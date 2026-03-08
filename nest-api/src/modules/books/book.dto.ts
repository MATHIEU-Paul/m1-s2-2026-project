import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import type { AuthorId } from '../authors/author.entity';
import type { BookTypeId } from './entities/booktype.entity';
import type { GenreId } from './entities/genre.entity';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(1500)
  @Max(2025)
  yearPublished: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10000)
  numberPages?: number;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsUUID(4)
  authorId: AuthorId;

  @IsUUID(4)
  @IsOptional()
  bookTypeId?: BookTypeId;

  @IsUUID(4)
  @IsOptional()
  genreId?: GenreId;
}

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsInt()
  @Min(1500)
  @Max(2025)
  @IsOptional()
  yearPublished: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10000)
  numberPages?: number;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsUUID(4)
  @IsOptional()
  authorId: AuthorId;

  @IsUUID(4)
  @IsOptional()
  bookTypeId?: BookTypeId;

  @IsUUID(4)
  @IsOptional()
  genreId?: GenreId;
}

export class GetBooksDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsUUID(4)
  @IsOptional()
  genreId?: GenreId;
}
