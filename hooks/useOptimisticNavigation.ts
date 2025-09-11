'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type NavigationState = {
  currentPath: string
  isNavigating: boolean
}

export function useOptimisticNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const [optimisticState, setOptimisticState] = useOptimistic<NavigationState, string>(
    { currentPath: pathname, isNavigating: false },
    (currentState, newPath) => ({
      currentPath: newPath,
      isNavigating: true
    })
  )

  const navigateTo = (path: string) => {
    // Optimistically update the path immediately
    setOptimisticState(path)
    
    // Then perform the actual navigation
    startTransition(() => {
      router.push(path)
    })
  }

  const prefetchRoute = (path: string) => {
    router.prefetch(path)
  }

  return {
    currentPath: optimisticState.currentPath,
    isNavigating: optimisticState.isNavigating || isPending,
    navigateTo,
    prefetchRoute,
    actualPath: pathname
  }
}