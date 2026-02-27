export type GoldPriceHistory = {
  success: boolean
  days: number
  type: string
  history: History[]
}

type History = {
  date: string
  prices: Prices
}
type Prices = {
  XAUUSD: PriceHistoryInfo
  DOJINHTV: PriceHistoryInfo
  DOHNL: PriceHistoryInfo
  DOHCML: PriceHistoryInfo
  BT9999NTT: PriceHistoryInfo
  BTSJC: PriceHistoryInfo
  PQHNVM: PriceHistoryInfo
  VIETTINMSJC: PriceHistoryInfo
  PQHN24NTT: PriceHistoryInfo
  SJ9999: PriceHistoryInfo
  SJL1L10: PriceHistoryInfo
  SJL1L10: PriceHistoryInfo
}

type PriceHistoryInfo = {
  name: string
  buy: number
  sell: number
  day_change_buy: number
  day_change_sell: number
  updates: number
}
