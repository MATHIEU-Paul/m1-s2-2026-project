export type AuthorModel = {
  id: string
  firstName: string
  lastName: string
  imagePath?: string | null
}

export type AuthorBookModel = {
  id: string
  title: string
  coverPath?: string | null
}

export type AuthorWithBookCountModel = AuthorModel & {
  bookCount: number
}

export type AuthorDetailsModel = AuthorModel & {
  books: AuthorBookModel[]
  purchasesAverage: number
}

export type CreateAuthorModel = {
  firstName: string
  lastName: string
  image?: string
}

export type UpdateAuthorModel = Partial<Omit<CreateAuthorModel, 'image'>> & {
  image?: string | null
}
