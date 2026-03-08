import axios from 'axios'
import { useCallback, useRef, useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import type {
  AuthorWithBookCountModel,
  CreateAuthorModel,
  UpdateAuthorModel,
} from '../AuthorModel'

export type AuthorSortField = 'firstName' | 'lastName'

type LoadAuthorsQuery = {
  limit: number
  offset: number
  sortField: AuthorSortField
  sortOrder: 'ASC' | 'DESC'
}

const DEFAULT_LOAD_QUERY: LoadAuthorsQuery = {
  limit: 10,
  offset: 0,
  sortField: 'lastName',
  sortOrder: 'ASC',
}

export const useAuthorProvider = () => {
  const [authors, setAuthors] = useState<AuthorWithBookCountModel[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const lastQueryRef = useRef<LoadAuthorsQuery>(DEFAULT_LOAD_QUERY)

  const loadAuthors = useCallback((query?: Partial<LoadAuthorsQuery>) => {
    const effectiveQuery: LoadAuthorsQuery = {
      ...lastQueryRef.current,
      ...query,
    }
    lastQueryRef.current = effectiveQuery
    setIsLoading(true)

    axios
      .get(`${API_BASE_URL}/authors`, {
        params: {
          limit: effectiveQuery.limit,
          offset: effectiveQuery.offset,
          sort: `${effectiveQuery.sortField},${effectiveQuery.sortOrder}`,
        },
      })
      .then(response => {
        setAuthors(response.data.data)
        setTotalCount(response.data.totalCount ?? 0)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }, [])

  const createAuthor = useCallback(
    (author: CreateAuthorModel) => {
      axios
        .post(`${API_BASE_URL}/authors`, author)
        .then(() => loadAuthors())
        .catch(err => console.error(err))
    },
    [loadAuthors],
  )

  const updateAuthor = useCallback(
    (id: string, input: UpdateAuthorModel) => {
      axios
        .patch(`${API_BASE_URL}/authors/${id}`, input)
        .then(() => loadAuthors())
        .catch(err => console.error(err))
    },
    [loadAuthors],
  )

  const deleteAuthor = useCallback(
    (id: string) => {
      axios
        .delete(`${API_BASE_URL}/authors/${id}`)
        .then(() => loadAuthors())
        .catch(err => console.error(err))
    },
    [loadAuthors],
  )

  return {
    authors,
    totalCount,
    isLoading,
    loadAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  }
}
