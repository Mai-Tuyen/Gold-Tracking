import { GoldPriceCurrent, GoldPriceHistory } from '@/features/home/type'

export const BASE_URL = 'https://www.vang.today/api/prices'
export const getGoldPrices = async (): Promise<GoldPriceCurrent> => {
  const response = await fetch(`${BASE_URL}`)
  const data = await response.json()
  return data
}

export const getGoldPricesHistory = async (day: number): Promise<GoldPriceHistory> => {
  const response = await fetch(`${BASE_URL}?days=${day}`)
  const data = await response.json()
  return data
}
