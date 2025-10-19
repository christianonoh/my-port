export const resolveHref = (
  documentType?: string,
  slug?: string,
): string | undefined => {
  switch (documentType) {
    case 'profile':
      return '/'
    case 'work':
      return '/about'
    case 'job':
      return '/about'
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    case 'blogPost':
      return slug ? `/blog/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}