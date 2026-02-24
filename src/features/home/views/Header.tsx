'use client'
import { PriceAlertModal } from '@/components/PriceAlertModal'
import Logo from '@/global/components/logo'
import { Button } from '@/global/components/ui/button'
import { Bell, RefreshCw, User } from 'lucide-react'
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
export default function Header() {
  const [user, setUser] = useState<UserType | null>(null)
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
    <header className='sticky top-0 z-50 border-b border-white/5 bg-[#121212]/85 backdrop-blur-xl'>
      <div className='mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6'>
        <Logo />
        <div className='flex shrink-0 items-center gap-6'>
          <div className='hidden flex-col items-end border-r border-white/10 pr-6 sm:flex'>
            <span className='text-[10px] font-bold tracking-wider text-slate-500 uppercase'>Cập nhật lúc</span>
            <p className='text-sm font-bold text-white'>14:30:05 - 24/05/2024</p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 rounded-full border border-transparent text-slate-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white'
            >
              <RefreshCw className='h-5 w-5' />
            </Button>
            <div className='relative'>
              <PriceAlertModal
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
            <nav className='hidden shrink-0 items-center space-x-6 md:flex'>
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
          </div>
        </div>
      </div>
    </header>
  )
}
