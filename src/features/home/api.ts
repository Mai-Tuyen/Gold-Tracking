export const BASE_URL = 'https://www.vang.today/api/prices'
export const getGoldPrices = async () => {
  const response = await fetch(`${BASE_URL}`)
  const data = await response.json()
  return data
}

export const getGoldPricesHistory = async (day: number) => {
  const response = await fetch(`${BASE_URL}?days=${day}`)
  const data = await response.json()
  return data
}
