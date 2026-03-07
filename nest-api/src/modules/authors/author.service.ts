import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorId } from './author.entity';
import {
  AuthorDetailsModel,
  AuthorModel,
  AuthorWithBookCountModel,
  CreateAuthorModel,
  FilterAuthorsModel,
  UpdateAuthorModel,
} from './author.model';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async getAllAuthors(
    params?: FilterAuthorsModel,
  ): Promise<[AuthorWithBookCountModel[], number]> {
    return this.authorRepository.getAllAuthors(params);
  }

  public async getAuthorById(
    id: AuthorId,
  ): Promise<AuthorDetailsModel> {
    const author = await this.authorRepository.getAuthorById(id);
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.createAuthor(author);
  }

  public async updateAuthor(
    id: AuthorId,
    author: UpdateAuthorModel,
  ): Promise<AuthorModel> {
    const updatedAuthor = await this.authorRepository.updateAuthor(id, author);
    if (!updatedAuthor) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return updatedAuthor;
  }

  public async deleteAuthor(id: AuthorId): Promise<void> {
    const deleted = await this.authorRepository.deleteAuthor(id);
    if (!deleted) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
  }
}
