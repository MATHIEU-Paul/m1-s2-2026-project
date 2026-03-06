import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteImage, saveImage } from 'src/utils/image';
import { Repository } from 'typeorm';
import { PurchaseService } from '../purchases/purchase.service';
import { AuthorEntity, AuthorId } from './author.entity';
import {
  AuthorDetailsModel,
  AuthorModel,
  AuthorWithBookCountModel,
  CreateAuthorModel,
  FilterAuthorsModel,
  UpdateAuthorModel,
} from './author.model';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    private readonly purchaseService: PurchaseService,
  ) {}

  public async getAllAuthors(
    input?: FilterAuthorsModel,
  ): Promise<[AuthorWithBookCountModel[], number]> {
    const sortField = input?.sort?.field ?? 'lastName';
    const sortDirection = input?.sort?.direction ?? 'ASC';

     const order =
      sortField === 'lastName'
        ? {
            'author.lastName': sortDirection,
            'author.firstName': sortDirection,
          }
        : {
            'author.firstName': sortDirection,
            'author.lastName': sortDirection,
          };

    const [authors, totalCount] = await this.authorRepository
      .createQueryBuilder('author')
      .select([
        'author.id',
        'author.firstName',
        'author.lastName',
        'author.imagePath',
      ])
      .loadRelationCountAndMap('author.bookCount', 'author.books') // Optimization to avoid N+1 query when fetching book count for each author
      .orderBy(order)
      .take(input?.limit)
      .skip(input?.offset)
      .getManyAndCount();

    return [
      authors.map((author) => ({
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
        imagePath: author.imagePath,
        bookCount: author.bookCount ?? 0,
      })),
      totalCount,
    ];
  }

  public async getAuthorById(
    id: AuthorId,
  ): Promise<AuthorDetailsModel | undefined> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { books: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imagePath: true,
        books: {
          id: true,
          title: true,
          coverPath: true,
        },
      },
    });

    if (!author) {
      return undefined;
    }

    const purchasesCount =
      await this.purchaseService.getPurchaseCountByAuthorId(author.id);
    const purchasesAverage = author.books?.length
      ? purchasesCount / author.books.length
      : 0;
    return {
      ...author,
      purchasesAverage,
    };
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    const { image, ...newAuthor } = author;

    const createdAuthor = await this.authorRepository.save(
      this.authorRepository.create(newAuthor),
    );

    if (!image) {
      return createdAuthor;
    }

    const imagePath = saveImage(image, 'authors', createdAuthor.id);
    await this.authorRepository.update(createdAuthor.id, { imagePath });

    return {
      ...createdAuthor,
      imagePath,
    };
  }

  public async updateAuthor(
    id: AuthorId,
    author: UpdateAuthorModel,
  ): Promise<AuthorModel | undefined> {
    const oldAuthor = await this.authorRepository.findOne({
      where: { id },
    });

    if (!oldAuthor) {
      return undefined;
    }

    const { image, ...updates } = author;

    let imagePath = oldAuthor.imagePath;
    if (image) {
      imagePath = saveImage(image, 'authors', oldAuthor.id);
    }

    await this.authorRepository.update(id, {
      ...updates,
      imagePath,
    });

    return this.getAuthorById(id);
  }

  public async deleteAuthor(id: AuthorId): Promise<void> {
    const result = await this.authorRepository.delete(id);
    if (result.affected && result.affected > 0) {
      deleteImage('authors', id);
    }
  }
}
