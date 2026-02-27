'use client'

import { useGoldPricesHistoryQuery } from '@/features/home/hooks/query'
import { useHomeStore } from '@/features/home/store'
import { Skeleton } from '@/global/components/ui/skeleton'
import { convertNumberToVND } from '@/global/lib/utils'
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface GoldPriceChartProps {
  days: number
  className?: string
}

const formatDateLabel = (dateString: string): string => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
}

export function LineChart({ days, className }: GoldPriceChartProps) {
  const { data: goldPriceHistory, isPending: isLoadingGoldPriceHistory } = useGoldPricesHistoryQuery(days)
  const { typeChecked } = useHomeStore()
  const chartData = React.useMemo(() => {
    const history = goldPriceHistory?.history ?? []
    const labels = history.map((item) => formatDateLabel(item.date)).reverse()
    const buyPrices = history.map((item) => item.prices[typeChecked].buy).reverse()
    const sellPrices = history.map((item) => item.prices[typeChecked].sell).reverse()

    return {
      labels,
      datasets: [
        {
          label: 'Mua vào',
          data: buyPrices,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          fill: false
        },
        {
          label: 'Bán ra',
          data: sellPrices,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          fill: false
        }
      ]
    }
  }, [goldPriceHistory, typeChecked])

  const allPrices = React.useMemo(() => {
    const buy = chartData.datasets[0]?.data ?? []
    const sell = chartData.datasets[1]?.data ?? []
    return [...buy, ...sell]
  }, [chartData])

  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) * 0.995 : undefined
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) * 1.005 : undefined

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: false,
          boxWidth: 12,
          boxHeight: 12,
          color: '#64748b'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            if (value == null) return `${context.dataset.label}: -`
            return `${context.dataset.label}: ${convertNumberToVND(value)}`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
          autoSkip: days !== 7,
          maxTicksLimit: days === 7 ? undefined : 6
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.12)'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => convertNumberToVND(Number(value))
        },
        min: minPrice,
        max: maxPrice
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        capBezierPoints: true
      }
    }
  }

  return (
    <div className={className}>
      {isLoadingGoldPriceHistory ? (
        <Skeleton className='h-full w-full' />
      ) : (
        <Line data={chartData} options={options} fallbackContent={<Skeleton className='h-full w-full' />} />
      )}
    </div>
  )
}
