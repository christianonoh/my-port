import { Suspense, ReactNode } from 'react'

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  </div>
)

const SuspenseWrapper = ({ 
  children, 
  fallback = <DefaultFallback />, 
  className = "" 
}: SuspenseWrapperProps) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}

export default SuspenseWrapper