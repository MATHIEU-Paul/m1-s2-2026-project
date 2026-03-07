import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseService } from '../purchases/purchase.service';
import { ClientId } from './client.entity';
import {
    ClientDetailsModel,
    ClientModel,
    ClientWithPurchaseCountModel,
    CreateClientModel,
    FilterClientsModel,
    UpdateClientModel,
} from './client.model';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly purchaseService: PurchaseService,
  ) {}

  public async getAllClients(
    params?: FilterClientsModel,
  ): Promise<[ClientWithPurchaseCountModel[], number]> {
    const [clients, totalCount] =
      await this.clientRepository.getAllClients(params);

    const purchaseCountsByClientId =
      await this.purchaseService.getPurchaseCountsByClientIds(
        clients.map((client) => client.id),
      );

    const clientsWithCount = clients.map((client) => ({
      ...client,
      purchaseCount: purchaseCountsByClientId[client.id] ?? 0,
    }));

    return [clientsWithCount, totalCount];
  }

  public async getClientById(
    id: ClientId,
  ): Promise<ClientDetailsModel> {
    const client = await this.clientRepository.getClientById(id);
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    const purchases = await this.purchaseService.getPurchasesByClientId(id);

    return {
      ...client,
      purchases,
    };
  }

  public async createClient(client: CreateClientModel): Promise<ClientModel> {
    return this.clientRepository.createClient(client);
  }

  public async updateClient(
    id: ClientId,
    client: UpdateClientModel,
  ): Promise<ClientModel> {
    const updatedClient = await this.clientRepository.updateClient(id, client);
    if (!updatedClient) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return updatedClient;
  }

  public async deleteClient(id: ClientId): Promise<void> {
    const deleted = await this.clientRepository.deleteClient(id);
    if (!deleted) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
