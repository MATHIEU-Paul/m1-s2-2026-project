import axios from 'axios'
import { useCallback, useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import type {
  PurchaseHomeSaleModel,
  PurchaseHomeSummaryModel,
} from '../PurchaseModel'

const DEFAULT_SUMMARY_LIMIT = 5

export const usePurchaseHomeSummaryProvider = () => {
  const [latestPurchases, setLatestPurchases] = useState<
    PurchaseHomeSaleModel[]
  >([])
  const [totalSales, setTotalSales] = useState(0)
  const [distinctCustomers, setDistinctCustomers] = useState(0)
  const [distinctBooks, setDistinctBooks] = useState(0)
  const [lastSaleDate, setLastSaleDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadHomeSummary = useCallback(async (limit = DEFAULT_SUMMARY_LIMIT) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const summaryResponse = await axios.get<PurchaseHomeSummaryModel>(
        `${API_BASE_URL}/purchases/home-summary`,
        {
          params: {
            limit,
          },
        },
      )

      setLatestPurchases(summaryResponse.data.latestSales)
      setTotalSales(summaryResponse.data.stats.totalSales)
      setDistinctCustomers(summaryResponse.data.stats.distinctCustomers)
      setDistinctBooks(summaryResponse.data.stats.distinctBooks)
      setLastSaleDate(summaryResponse.data.stats.lastSaleDate)
    } catch (error) {
      console.error(error)
      setErrorMessage('Unable to load home data right now.')
      setLatestPurchases([])
      setTotalSales(0)
      setDistinctCustomers(0)
      setDistinctBooks(0)
      setLastSaleDate(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    latestPurchases,
    totalSales,
    distinctCustomers,
    distinctBooks,
    lastSaleDate,
    isLoading,
    errorMessage,
    loadHomeSummary,
  }
}
