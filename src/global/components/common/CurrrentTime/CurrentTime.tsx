import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(dayjs().format('DD/MM/YYYY HH:mm:ss'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('DD/MM/YYYY HH:mm:ss'))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className='w-[155px] text-xs font-bold text-white'>{dayjs().format('DD/MM/YYYY - HH:MM:ss')}</div>
}
