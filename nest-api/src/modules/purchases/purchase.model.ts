import { BookId } from '../books/entities/book.entity';
import { ClientId } from '../clients/client.entity';

export type PurchaseModel = {
  id: string;
  clientId: ClientId;
  bookId: BookId;
  purchaseDate: string;
};

export type PurchaseHomeSaleModel = PurchaseModel & {
  clientName: string;
  bookTitle: string;
};

export type PurchaseHomeStatsModel = {
  totalSales: number;
  distinctCustomers: number;
  distinctBooks: number;
  lastSaleDate: string | null;
};

export type PurchaseHomeSummaryModel = {
  latestSales: PurchaseHomeSaleModel[];
  stats: PurchaseHomeStatsModel;
};

export type ClientPurchaseDetailsModel = {
  id: string;
  bookId: BookId;
  bookTitle: string;
  bookAuthor: string;
  bookCoverPath?: string | null;
  purchaseDate: string;
};

export type BookPurchaseDetailsModel = {
  id: string;
  clientId: ClientId;
  clientFirstName: string;
  clientLastName: string;
  clientImagePath?: string | null;
  purchaseDate: string;
};

export type CreatePurchaseModel = {
  clientId: ClientId;
  bookId: BookId;
  purchaseDate: string;
};
