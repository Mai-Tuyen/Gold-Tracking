'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/global/components/ui/dialog'
import { Button } from '@/global/components/ui/button'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { createClient } from '@/global/lib/supabase/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/global/components/logo'

export function LoginModal() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const nextUrl = searchParams.get('next')
  const [open, setOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${encodeURIComponent(pathname ?? '/')}/auth/callback?next=${nextUrl}`,
          scopes: 'https://www.googleapis.com/auth/userinfo.email'
        }
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    router.back()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='dark:border-border-dark dark:bg-card-dark border p-5 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-6'>
        <DialogHeader className='space-y-2 text-center sm:space-y-3'>
          <DialogTitle className='flex flex-col items-center justify-center gap-2 bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>
            <Logo />
            Welcome to GoldTrack
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-3 py-4 sm:gap-4 sm:py-5'>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className='h-11 w-full cursor-pointer border text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg sm:h-12 sm:text-base'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 sm:h-5 sm:w-5' />
                <span>Đăng nhập...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2 sm:gap-3'>
                <FcGoogle className='h-4 w-4 sm:h-5 sm:w-5' />
                <span>Đăng nhập với Google</span>
              </div>
            )}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='dark:bg-background-dark bg-white/80 px-2 py-1 text-slate-500'>Xác thực an toàn</span>
            </div>
          </div>

          <p className='px-3 text-center text-[10px] text-slate-500 sm:px-4 sm:text-xs'>
            Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và chính sách bảo mật của chúng tôi
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
