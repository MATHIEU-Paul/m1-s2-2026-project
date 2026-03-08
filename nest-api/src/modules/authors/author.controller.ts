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
import {
  CreateAuthorDto,
  GetAllAuthorsDto,
  UpdateAuthorDto,
} from './author.dto';
import { AuthorId } from './author.entity';
import { AuthorSortField, GetAuthorsModel } from './author.model';
import { AuthorService } from './author.service';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAllAuthors(
    @Query() rawParams: GetAllAuthorsDto,
  ): Promise<GetAuthorsModel> {
    const params = parseListQueryParams<AuthorSortField>(rawParams, {
      defaultSortField: 'lastName',
      defaultSortDirection: 'ASC',
      defaultOffset: 0,
      minLimit: 1,
      maxLimit: 100,
    });

    const [authors, totalCount] =
      await this.authorService.getAllAuthors(params);

    return {
      data: authors,
      totalCount,
    };
  }

  @Post()
  public async createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get(':id')
  public async getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(id as AuthorId);
  }

  @Patch(':id')
  public async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.updateAuthor(id as AuthorId, updateAuthorDto);
  }

  @Delete(':id')
  public async deleteAuthor(@Param('id') id: string) {
    await this.authorService.deleteAuthor(id as AuthorId);
    return { message: 'Author deleted successfully' };
  }
}
