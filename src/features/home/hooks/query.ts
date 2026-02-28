import { useQuery } from '@tanstack/react-query'
import { getGoldNews, getGoldPrices, getGoldPricesHistory } from '../api'

export const useGoldPricesQuery = () => {
  return useQuery({
    queryKey: ['goldPrices'],
    queryFn: getGoldPrices,
    refetchInterval: 1000 * 5 // 3 seconds
  })
}

export const useGoldPricesHistoryQuery = (day: number) => {
  return useQuery({
    queryKey: ['goldPricesHistory', day],
    queryFn: () => getGoldPricesHistory(day)
  })
}

export const useGoldNewsQuery = () => {
  return useQuery({
    queryKey: ['goldNews'],
    queryFn: getGoldNews,
    refetchInterval: 1000 * 60 * 5
  })
}
