import axios from 'axios'
import { useCallback, useRef, useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import type {
  ClientWithPurchaseCountModel,
  CreateClientModel,
  UpdateClientModel,
} from '../ClientModel'

export type ClientSortField = 'firstName' | 'lastName' | 'email'

type LoadClientsQuery = {
  limit: number
  offset: number
  sortField: ClientSortField
  sortOrder: 'ASC' | 'DESC'
}

const DEFAULT_LOAD_QUERY: LoadClientsQuery = {
  limit: 10,
  offset: 0,
  sortField: 'lastName',
  sortOrder: 'ASC',
}

export const useClientProvider = () => {
  const [clients, setClients] = useState<ClientWithPurchaseCountModel[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const lastQueryRef = useRef<LoadClientsQuery>(DEFAULT_LOAD_QUERY)

  const loadClients = useCallback((query?: Partial<LoadClientsQuery>) => {
    const effectiveQuery: LoadClientsQuery = {
      ...lastQueryRef.current,
      ...query,
    }
    lastQueryRef.current = effectiveQuery
    setIsLoading(true)

    axios
      .get(`${API_BASE_URL}/clients`, {
        params: {
          limit: effectiveQuery.limit,
          offset: effectiveQuery.offset,
          sort: `${effectiveQuery.sortField},${effectiveQuery.sortOrder}`,
        },
      })
      .then(data => {
        setClients(data.data.data)
        setTotalCount(data.data.totalCount ?? 0)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }, [])

  const createClient = useCallback(
    (client: CreateClientModel) => {
      axios
        .post(`${API_BASE_URL}/clients`, client)
        .then(() => {
          loadClients()
        })
        .catch(err => console.error(err))
    },
    [loadClients],
  )

  const updateClient = useCallback(
    (id: string, input: UpdateClientModel) => {
      axios
        .put(`${API_BASE_URL}/clients/${id}`, input)
        .then(() => {
          loadClients()
        })
        .catch(err => console.error(err))
    },
    [loadClients],
  )

  const deleteClient = useCallback(
    (id: string) => {
      axios
        .delete(`${API_BASE_URL}/clients/${id}`)
        .then(() => {
          loadClients()
        })
        .catch(err => console.error(err))
    },
    [loadClients],
  )

  return {
    clients,
    totalCount,
    isLoading,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
