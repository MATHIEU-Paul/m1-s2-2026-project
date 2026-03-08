export type ClientModel = {
  id: string
  firstName: string
  lastName: string
  email?: string
  imagePath?: string | null
}

export type ClientPurchase = {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  purchaseDate: string
  bookCoverPath?: string
}

export type ClientWithPurchaseCountModel = ClientModel & {
  purchaseCount: number
}

export type ClientWithPurchasesModel = ClientModel & {
  purchases: ClientPurchase[]
}

export type CreateClientModel = {
  firstName: string
  lastName: string
  email?: string
  image?: string
}

export type UpdateClientModel = Partial<Omit<CreateClientModel, 'image'>> & {
  image?: string | null
}
