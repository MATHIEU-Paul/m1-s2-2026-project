export type BookMetadataModel = {
  id: string
  name: string
}

export type BookModel = {
  id: string
  title: string
  yearPublished: number
  author: {
    id: string
    firstName: string
    lastName: string
  }
  numberPages?: number
  bookType?: BookMetadataModel
  genre?: BookMetadataModel
  coverPath?: string | null
}

export type BookPurchase = {
  id: string
  clientId: string
  clientFirstName: string
  clientLastName: string
  clientImagePath?: string | null
  purchaseDate: string
}

export type BookWithPurchaseCountModel = BookModel & {
  purchaseCount: number
}

export type BookWithPurchasesModel = BookModel & {
  purchases: BookPurchase[]
}

export type CreateBookModel = {
  title: string
  yearPublished: number
  numberPages?: number
  coverImage?: string
  authorId: string
  bookTypeId?: string
  genreId?: string
}

export type UpdateBookModel = Partial<Omit<CreateBookModel, 'coverImage'>> & {
  coverImage?: string | null
}
