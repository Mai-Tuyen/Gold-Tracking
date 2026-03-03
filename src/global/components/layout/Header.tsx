'use client'
import Logo from '@/global/components/common/logo'
import { Button } from '@/global/components/ui/button'
import { Bell, Menu, RefreshCw } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { User as UserType } from '@supabase/supabase-js'
import { storage } from '@/global/lib/storage'
import { createClient } from '@/global/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/global/components/ui/dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'
import ListPriceAlertModal from '@/features/home/views/ListPriceAlertModal'
import dayjs from 'dayjs'
import CurrentTime from '@/global/components/common/CurrrentTime/CurrentTime'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/global/components/ui/sheet'
export default function Header() {
  const [user, setUser] = useState<UserType | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()
  useLayoutEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      storage.set('user', session?.user ?? null)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    storage.remove('user')
    setUser(null)
  }

  return (
    <header className='bg-background-dark/85 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl'>
      <div className='mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6'>
        <Logo />
        <div className='flex shrink-0 items-center gap-6'>
          <div className='flex-col items-end border-r border-white/10'>
            <span className='text-[10px] font-bold tracking-wider text-slate-500 uppercase'>Cập nhật lúc</span>
            <CurrentTime />
          </div>
          <div className='flex items-center gap-3'>
            {/* <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 rounded-full border border-transparent text-slate-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white'
            >
              <RefreshCw className='h-5 w-5' />
            </Button> */}
            <div className='relative hidden sm:block'>
              <ListPriceAlertModal
                trigger={
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-10 w-10 rounded-full border border-transparent text-slate-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white'
                  >
                    <Bell className='h-5 w-5' />
                  </Button>
                }
              />
              <span className='ring-background-dark absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-rose-500 ring-2'></span>
            </div>
            <nav className='hidden shrink-0 items-center space-x-6 sm:flex'>
              {user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className='cursor-pointer'>
                    <div className='border-primary bg-primary/10 flex items-center space-x-2 rounded-full border p-1 px-2'>
                      <Image
                        src={user.user_metadata?.avatar_url}
                        alt='User Avatar'
                        width={32}
                        height={32}
                        className='rounded-full border-2 from-blue-600 to-purple-600'
                      />
                      <span className='dark:text-primary shrink-0 text-sm text-gray-600'>
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
                      <span className='text-sm font-medium text-red-600 transition-colors hover:text-red-700'>
                        Đăng xuất
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href='/auth/login'
                  className='text-primary hover:bg-primary/20 rounded-md border border-gray-500 px-4 py-[6px] font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
            {/* Mobile Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='sm:hidden'>
                <button
                  className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  aria-label='Open menu'
                >
                  <Menu className='h-6 w-6' />
                </button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[280px] sm:w-[340px]'>
                <SheetHeader>
                  <SheetTitle className='flex items-center space-x-2'>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <nav className='mt-8 flex flex-col space-y-4'>
                  {user ? (
                    <>
                      <div className='mb-6 flex items-center space-x-3 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-700'>
                        <Image
                          src={user.user_metadata?.avatar_url}
                          alt='User Avatar'
                          width={48}
                          height={48}
                          className='border-primary rounded-full border-2'
                        />
                        <div className='flex flex-col overflow-hidden'>
                          <span className='truncate text-sm font-semibold text-gray-900 dark:text-white'>
                            {user.user_metadata?.full_name || 'User'}
                          </span>
                          <span className='truncate text-xs text-gray-600 dark:text-gray-300'>{user.email}</span>
                        </div>
                      </div>

                      <Link
                        href='/'
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      >
                        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                          />
                        </svg>
                        <span className='text-base font-medium'>Trang chủ</span>
                      </Link>
                      <div className='relative'>
                        <ListPriceAlertModal
                          trigger={
                            <Button
                              size='icon'
                              className='flex w-full items-center justify-start border border-transparent bg-transparent pl-4 text-white'
                            >
                              <Bell className='h-5 w-5' /> Danh sách thông báo
                            </Button>
                          }
                        />
                      </div>

                      <div className='my-4 border-t border-gray-200 dark:border-gray-700' />

                      <button
                        onClick={() => {
                          handleSignOut()
                          setMobileMenuOpen(false)
                        }}
                        className='flex items-center space-x-3 rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20'
                      >
                        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                          />
                        </svg>
                        <span className='text-base font-medium'>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href='/'
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      >
                        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                          />
                        </svg>
                        <span className='text-base font-medium'>Trang chủ</span>
                      </Link>

                      <Link
                        href='/auth/login'
                        onClick={() => setMobileMenuOpen(false)}
                        className='bg-gold flex items-center space-x-3 rounded-lg px-4 py-3 text-black shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'
                      >
                        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                          />
                        </svg>
                        <span className='font-medium'>Đăng nhập</span>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
