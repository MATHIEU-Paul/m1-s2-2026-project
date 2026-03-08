import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorEntity, type AuthorId } from '../../authors/author.entity';
import { BookTypeEntity, type BookTypeId } from './booktype.entity';
import { GenreEntity, type GenreId } from './genre.entity';

export type BookId = string & { __brand: 'Book' };

@Entity('books')
export class BookEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: BookId;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'year_published', type: 'int', nullable: true })
  yearPublished: number;

  @Column({ name: 'number_pages', type: 'int', nullable: true })
  numberPages: number;

  @Column({ name: 'cover_path', type: 'varchar', nullable: true })
  coverPath?: string | null;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: AuthorId;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @ManyToOne(() => BookTypeEntity, { nullable: true })
  @JoinColumn({ name: 'book_type_id' })
  bookType?: BookTypeEntity;

  @Column({ name: 'book_type_id', type: 'uuid', nullable: true })
  bookTypeId?: BookTypeId;

  @ManyToOne(() => GenreEntity, { nullable: true })
  @JoinColumn({ name: 'genre_id' })
  genre?: GenreEntity;

  @Column({ name: 'genre_id', type: 'uuid', nullable: true })
  genreId?: GenreId;
}
