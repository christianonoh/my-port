'use client'

// TODO: Update to use new next-sanity v10 live query API
// LiveQueryProvider has been replaced in next-sanity v10
// For now, we'll just render children without live query functionality

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  if (!token) throw new TypeError('Missing token')
  return <>{children}</>
}
