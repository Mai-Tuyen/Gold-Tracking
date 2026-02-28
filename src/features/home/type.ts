export type GoldPriceHistory = {
  success: boolean
  days: number
  type: string
  history: History[]
}

type History = {
  date: string
  prices: HistoryPrices
}
type HistoryPrices = {
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
}

type PriceHistoryInfo = {
  name: string
  buy: number
  sell: number
  day_change_buy: number
  day_change_sell: number
  updates: number
}

export type GoldPriceCurrent = {
  success: boolean
  timestamp: number
  time: string
  date: string
  count: number
  prices: CurrentPrices
}

type CurrentPrices = {
  XAUUSD: CurrentPriceInfo
  DOJINHTV: CurrentPriceInfo
  DOHNL: CurrentPriceInfo
  DOHCML: CurrentPriceInfo
  BT9999NTT: CurrentPriceInfo
  BTSJC: CurrentPriceInfo
  PQHNVM: CurrentPriceInfo
  VIETTINMSJC: CurrentPriceInfo
  PQHN24NTT: CurrentPriceInfo
  SJ9999: CurrentPriceInfo
  SJL1L10: CurrentPriceInfo
  VNGSJC: CurrentPriceInfo
}

type CurrentPriceInfo = {
  name: string
  buy: number
  sell: number
  change_buy: number
  change_sell: number
  currency: string
}

export type NewsItem = {
  title: string
  link: string
  source: string
  publishedAt: string
}
