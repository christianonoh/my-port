'use client'

import { use, useMemo } from 'react'

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const promise = useMemo(() => fetcher(), deps)
  return use(promise)
}

export function createAsyncResource<T>(fetcher: () => Promise<T>) {
  let status = 'pending'
  let result: T
  let suspender = fetcher().then(
    (data) => {
      status = 'success'
      result = data
    },
    (error) => {
      status = 'error'
      result = error
    }
  )

  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}