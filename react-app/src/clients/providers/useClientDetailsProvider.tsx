import { useCallback, useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import type {
  ClientModel,
  ClientPurchase,
  ClientWithPurchasesModel,
  UpdateClientModel,
} from '../ClientModel'

export const useClientDetailsProvider = (id: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [client, setClient] = useState<ClientModel | null>(null)
  const [purchases, setPurchases] = useState<ClientPurchase[]>([])

  const loadClient = useCallback(() => {
    setIsLoading(true)
    fetch(`${API_BASE_URL}/clients/${id}`)
      .then(response => response.json())
      .then((data: ClientWithPurchasesModel) => {
        setClient(data)
        setPurchases(data.purchases || [])
      })
      .catch(err => {
        console.error(err)
        setClient(null)
        setPurchases([])
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const updateClient = useCallback(
    (updates: UpdateClientModel) => {
      if (!client) return

      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
        .then(response => response.json())
        .then(data => setClient(data))
        .catch(err => console.error(err))
    },
    [client, id],
  )

  return { isLoading, client, purchases, loadClient, updateClient }
}
