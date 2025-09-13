import { client } from '@/sanity/sanity.client'
import { token } from '@/sanity/sanity.fetch'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { resolveHref } from '@/sanity/sanity.links'


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const documentType = searchParams.get('type')

  if (!token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required.',
    )
  }
  if (!secret) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Simple secret validation
  const expectedSecret = process.env.SANITY_PREVIEW_SECRET || '';
  if (secret !== expectedSecret) {
    return new Response('Invalid secret', { status: 401 })
  }

  const href = resolveHref(documentType!, slug!)
  if (!href) {
    return new Response(
      'Unable to resolve preview URL based on the current document type and slug',
      { status: 400 },
    )
  }

  (await draftMode()).enable()

  redirect(href)
}
