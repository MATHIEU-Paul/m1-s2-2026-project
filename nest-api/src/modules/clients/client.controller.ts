import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { parseListQueryParams } from '../../utils/list-query';
import {
  CreateClientDto,
  GetAllClientsDto,
  UpdateClientDto,
} from './client.dto';
import { ClientId } from './client.entity';
import { ClientSortField } from './client.model';
import { ClientService } from './client.service';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getAllClients(@Query() rawParams: GetAllClientsDto) {
    const params = parseListQueryParams<ClientSortField>(rawParams, {
      defaultSortField: 'lastName',
      defaultSortDirection: 'ASC',
      defaultOffset: 0,
      minLimit: 1,
      maxLimit: 100,
    });

    const [data, totalCount] = await this.clientService.getAllClients(params);
    return { data, totalCount };
  }

  @Get(':id')
  async getClientById(@Param('id') id: string) {
    return this.clientService.getClientById(id as ClientId);
  }

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(id as ClientId, updateClientDto);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    await this.clientService.deleteClient(id as ClientId);
    return { message: 'Client deleted successfully' };
  }
}
