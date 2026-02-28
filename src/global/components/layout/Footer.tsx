import { Banknote, Globe, Mail, Share2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='dark:border-border-dark dark:bg-card-dark mt-20 border-t border-slate-200 bg-slate-100'>
      <div className='mx-auto max-w-[1440px] px-6 py-16'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-6'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary rounded-lg p-1'>
                <Banknote className='text-background-dark h-3.5 w-3.5' />
              </div>
              <span className='text-xl font-black tracking-tighter text-slate-900 dark:text-white'>
                GOLD<span className='text-primary'>TRACK</span>
              </span>
            </div>
            <p className='text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
              Người bạn đồng hành tài chính giúp theo dõi thị trường kim loại quý tại Việt Nam và toàn cầu. Dữ liệu thời
              gian thực, phân tích chuyên sâu.
            </p>
            <div className='flex gap-4'>
              <a
                href='#'
                className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
              >
                <Globe className='h-4 w-4' />
              </a>
              <a
                href='#'
                className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
              >
                <Share2 className='h-4 w-4' />
              </a>
              <a
                href='#'
                className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
              >
                <Mail className='h-4 w-4' />
              </a>
            </div>
          </div>
          <div>
            <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Dữ liệu thị trường</h4>
            <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Vàng miếng SJC
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Vàng PNJ
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Giá DOJI
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Giá vàng thế giới
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Tài nguyên</h4>
            <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Công cụ tính giá
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Phân tích thị trường
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Dữ liệu lịch sử
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Ứng dụng di động
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Pháp lý</h4>
            <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Phương pháp dữ liệu
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary transition-colors'>
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='dark:border-border-dark mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row'>
          <p className='text-xs text-slate-500 dark:text-slate-500'>© 2026 MaiTuyen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
