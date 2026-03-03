import type { NewsItem } from '@/features/home/type'
import Parser from 'rss-parser'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const parser = new Parser()

const FEEDS = ['https://vnexpress.net/rss/kinh-doanh.rss', 'https://vnexpress.net/rss/tin-moi-nhat.rss']
const GOLD_KEYWORDS = ['vàng', 'sjc', 'doji', 'pnj']

export async function GET() {
  try {
    const results = await Promise.allSettled(FEEDS.map((feedUrl) => parser.parseURL(feedUrl)))
    const goldRelatedDedupe = new Map<string, NewsItem>()
    const fallbackDedupe = new Map<string, NewsItem>()
    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      const feed = result.value

      for (const item of feed.items ?? []) {
        if (!item.link || !item.title) continue
        if (fallbackDedupe.has(item.link)) continue

        const normalizedItem: NewsItem = {
          title: item.title,
          link: item.link,
          source: feed.title ?? 'News',
          publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString()
        }

        fallbackDedupe.set(item.link, normalizedItem)

        const lowerTitle = item.title.toLowerCase()
        const lowerDescription = (item.contentSnippet ?? item.content ?? '').toLowerCase()
        const isGoldRelated = GOLD_KEYWORDS.some(
          (keyword) => lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
        )
        if (!isGoldRelated) continue

        goldRelatedDedupe.set(item.link, normalizedItem)
      }
    }

    const preferredItems = Array.from(goldRelatedDedupe.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
    const fallbackItems = Array.from(fallbackDedupe.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
    const items = preferredItems.length > 0 ? preferredItems : fallbackItems
    return NextResponse.json(
      { items, success: true },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        items: [],
        success: false,
        error: 'Lỗi khi tải tin nổi bật',
        detail: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 200 }
    )
  }
}
