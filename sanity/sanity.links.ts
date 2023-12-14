export const resolveHref = (
  documentType?: string,
  slug?: string,
): string | undefined => {
  switch (documentType) {
    case 'profile':
      return '/'
    case 'job':
      return '/about'
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}