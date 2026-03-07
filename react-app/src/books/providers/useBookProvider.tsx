import axios from 'axios'
import { useCallback, useRef, useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import type {
  BookWithPurchaseCountModel,
  CreateBookModel,
  UpdateBookModel,
} from '../BookModel'

export type BookSortField = 'title' | 'authorName' | 'yearPublished'

type LoadBooksQuery = {
  limit: number
  offset: number
  sortField: BookSortField
  sortOrder: 'ASC' | 'DESC'
  genreId?: string
}

const DEFAULT_LOAD_QUERY: LoadBooksQuery = {
  limit: 10,
  offset: 0,
  sortField: 'title',
  sortOrder: 'ASC',
}

export const useBookProvider = () => {
  const [books, setBooks] = useState<BookWithPurchaseCountModel[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const lastQueryRef = useRef<LoadBooksQuery>(DEFAULT_LOAD_QUERY)

  const loadBooks = useCallback((query?: Partial<LoadBooksQuery>) => {
    const effectiveQuery: LoadBooksQuery = {
      ...lastQueryRef.current,
      ...query,
    }
    lastQueryRef.current = effectiveQuery

    axios
      .get(`${API_BASE_URL}/books`, {
        params: {
          limit: effectiveQuery.limit,
          offset: effectiveQuery.offset,
          sort: `${effectiveQuery.sortField},${effectiveQuery.sortOrder}`,
          ...(effectiveQuery.genreId
            ? { genreId: effectiveQuery.genreId }
            : {}),
        },
      })
      .then(data => {
        setBooks(data.data.data)
        setTotalCount(data.data.totalCount ?? 0)
      })
      .catch(err => console.error(err))
  }, [])

  const createBook = (book: CreateBookModel) => {
    axios
      .post(`${API_BASE_URL}/books`, book)
      .then(() => {
        loadBooks()
      })
      .catch(err => console.error(err))
  }

  const updateBook = (id: string, input: UpdateBookModel) => {
    axios
      .patch(`${API_BASE_URL}/books/${id}`, input)
      .then(() => {
        loadBooks()
      })
      .catch(err => console.error(err))
  }

  const deleteBook = (id: string) => {
    axios
      .delete(`${API_BASE_URL}/books/${id}`)
      .then(() => {
        loadBooks()
      })
      .catch(err => console.error(err))
  }

  return { books, totalCount, loadBooks, createBook, updateBook, deleteBook }
}
