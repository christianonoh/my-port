export const resolveHref = (
  documentType?: string,
  slug?: string,
): string | undefined => {
  switch (documentType) {
    case 'profile' || 'job':
      return 'about/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}