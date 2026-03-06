import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteImage, saveImage } from 'src/utils/image';
import { Repository } from 'typeorm';
import { ClientEntity, ClientId } from './client.entity';
import {
  ClientModel,
  CreateClientModel,
  FilterClientsModel,
  UpdateClientModel,
} from './client.model';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  public async getAllClients(
    input?: FilterClientsModel,
  ): Promise<[ClientModel[], number]> {
    const sortField = input?.sort?.field ?? 'lastName';
    const sortDirection = input?.sort?.direction ?? 'ASC';

    // On créé l'order dynamique en fonction du champ de tri, en ajoutant un tri secondaire sur le nom si le tri principal n'est pas déjà le nom
    const order =
      sortField === 'lastName'
        ? {
            lastName: sortDirection,
            firstName: sortDirection,
          }
        : {
            firstName: sortDirection,
            lastName: sortDirection,
          };

    return this.clientRepository.findAndCount({
      take: input?.limit,
      skip: input?.offset,
      order,
    });
  }

  public async getClientById(id: ClientId): Promise<ClientModel | undefined> {
    const client = await this.clientRepository.findOne({ where: { id } });
    return client ?? undefined;
  }

  public async createClient(client: CreateClientModel): Promise<ClientModel> {
    const { image, ...newClient } = client;

    const createdClient = await this.clientRepository.save(
      this.clientRepository.create(newClient),
    );

    if (!image) {
      return createdClient;
    }

    const imagePath = saveImage(image, 'clients', createdClient.id);
    await this.clientRepository.update(createdClient.id, { imagePath });

    return {
      ...createdClient,
      imagePath,
    };
  }

  public async updateClient(
    id: ClientId,
    client: UpdateClientModel,
  ): Promise<ClientModel | undefined> {
    const oldClient = await this.clientRepository.findOne({
      where: { id },
    });

    if (!oldClient) {
      return undefined;
    }

    const { image, ...updates } = client;

    let imagePath = oldClient.imagePath;
    if (image) {
      imagePath = saveImage(image, 'clients', oldClient.id);
    }

    await this.clientRepository.update(id, {
      ...updates,
      imagePath,
    });

    return this.getClientById(id);
  }

  public async deleteClient(id: ClientId): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected && result.affected > 0) {
      deleteImage('clients', id);
    }
  }
}
