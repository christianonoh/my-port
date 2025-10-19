import { MetadataRoute } from 'next'
import siteMetadata from '@/utils/siteMetaData'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/', '/admin/'],
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}
