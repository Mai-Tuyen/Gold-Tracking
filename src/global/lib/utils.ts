import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSEOMetadata({
  title,
  description,
  url,
  thumbnailUrl
}: {
  title: string
  description: string
  url: string
  thumbnailUrl: string
}) {
  return {
    title: title,
    description: description,
    openGraph: {
      type: 'website',
      url: url,
      title: title,
      description: description,
      images: [{ url: thumbnailUrl, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [{ url: thumbnailUrl }]
    }
  }
}

export function convertNumberToVND(number?: number) {
  if (!number) return '0'
  // convert 185300000 to 185.3M
  const million = number / 1000000
  const thousand = number / 1000
  if (number >= 1000000) {
    return `${million.toFixed(1)}M`
  } else if (number >= 1000) {
    return `${thousand.toFixed(1)}K`
  }
}

export function formatNumberToVND(number?: number, currency: string = 'VND') {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: currency }).format(number)
}
