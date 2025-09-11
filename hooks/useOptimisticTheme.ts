'use client'

import { useOptimistic, useTransition, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function useOptimisticTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  
  // Wait for hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const currentTheme = mounted ? (resolvedTheme || theme || 'light') : 'light'
  
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    currentTheme,
    (_, newTheme: string) => newTheme
  )

  const toggleTheme = () => {
    const newTheme = optimisticTheme === 'dark' ? 'light' : 'dark'
    
    // Update both optimistic and actual theme within the transition
    startTransition(() => {
      setOptimisticTheme(newTheme)
      setTheme(newTheme)
    })
  }

  return {
    theme: mounted ? optimisticTheme : currentTheme,
    toggleTheme,
    isPending,
    mounted
  }
}