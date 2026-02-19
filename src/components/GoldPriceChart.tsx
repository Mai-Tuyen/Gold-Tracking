'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ScriptableContext
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface GoldPriceChartProps {
  timeRange: '30D' | '90D' | '1Y' | 'ALL'
  className?: string
}

export function GoldPriceChart({ timeRange, className }: GoldPriceChartProps) {
  const getDataForRange = (range: string) => {
    switch (range) {
      case '30D':
        return {
          labels: ['May 01', 'May 08', 'May 15', 'May 22', 'Jun 01'],
          prices: [2300, 2320, 2310, 2335, 2345.5]
        }
      case '90D':
        return {
          labels: ['Mar', 'Apr', 'May'],
          prices: [2200, 2250, 2345.5]
        }
      case '1Y':
        return {
          labels: ['Jun 2023', 'Sep 2023', 'Dec 2023', 'Mar 2024', 'May 2024'],
          prices: [1950, 2100, 2200, 2250, 2345.5]
        }
      default:
        return {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          prices: [1800, 1900, 2000, 2200, 2345.5]
        }
    }
  }

  const { labels, prices } = getDataForRange(timeRange)

  const data = {
    labels,
    datasets: [
      {
        label: 'Gold Price',
        data: prices,
        borderColor: '#f4af25',
        borderWidth: 4,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(244, 175, 37, 0.4)')
          gradient.addColorStop(1, 'rgba(244, 175, 37, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: any) => {
          const index = ctx.dataIndex
          const count = ctx.dataset.data.length
          // Show dots at specific points like in the design (approximate)
          if (index === 1 || index === 2 || index === 3 || index === count - 1) return 4
          return 0
        },
        pointBackgroundColor: '#f4af25',
        pointBorderColor: '#f4af25',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#f4af25',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false, // Disable default tooltip to use custom HTML overlay if needed, but for now we'll rely on chart.js default
      }
    },
    scales: {
      x: {
        display: false, // Hide x-axis labels inside chart area (we display them below in custom div)
        grid: {
          display: false
        }
      },
      y: {
        display: false, // Hide y-axis
        grid: {
          display: false
        },
        min: Math.min(...prices) * 0.95,
        max: Math.max(...prices) * 1.05
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
      <Line data={data} options={options} />
    </div>
  )
}
