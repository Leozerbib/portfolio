'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useOS, osActions } from '@/hooks/useOS'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Background } from '../background'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMounted, setIsMounted] = useState(false)
  const { dispatch } = useOS()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  })

  // Set mounted state and update time every second
  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (values.password === 'portfolio' || values.password === 'admin') {
      dispatch(osActions.login(values.password))
    } else {
      form.setError('password', {
        type: 'manual',
        message: 'Invalid password. Try "portfolio" or "admin"',
      })
    }

    setIsLoading(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen flex items-stretch justify-center p-4 bg-gradient-to-br from-background via-background/95 to-muted/20">
      <Background />
      <div className="w-full flex flex-col items-center justify-center z-10">
        {/* Date and Time Display */}
        <div className="text-center mb-6 w-full h-1/4 flex flex-col items-center justify-center">
          <div className="text-8xl w-full font-serif font-bold text-foreground mb-2">
            {isMounted ? formatTime(currentTime) : '00:00:00'}
          </div>
          <div className="text-xl font-sans text-muted-foreground">
            {isMounted ? formatDate(currentTime) : 'Loading...'}
          </div>
        </div>

        <div className="w-full h-2/4 flex flex-col items-center justify-center gap-6">
          <div>
            <Avatar className='w-24 h-24'>
              <Image src="/avatar.jpg" alt="Avatar" width={100} height={100} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              Leo Zerbib
            </div>
          </div>


            {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='gap-3 flex flex-col items-center justify-center'>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password..."
                        className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                        disabled={isLoading}
                        autoFocus
                        size={40}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size={"sm"}
                className="w-full"
                disabled={isLoading || !form.watch('password')?.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
            
            {/* Hint */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Try password portfolio
              </p>
            </div>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center w-full h-1/4 flex flex-col items-center justify-end">
          <p className="text-xs text-muted-foreground">
            Portfolio OS v1.0 • Built with Next.js & React
          </p>
        </div>
      </div>
    </div>
  )
}