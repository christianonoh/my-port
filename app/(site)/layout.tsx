import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from './components/global/Footer'
import Navbar from './components/global/Navbar'

const inter = Inter({ subsets: ['latin'] })

type MyMetadata = Metadata & {
  image: string;
  url: string;
}

export const metadata: MyMetadata = {
  title: 'Christian Onoh - Portfolio',
  description: 'Christian Onoh is a full-stack developer with experience in JavaScript, React, Ruby on Rails, Node.js, and more. Check out his portfolio to see his work!',
  authors: [{ name: 'Christian Onoh' }],
  keywords: 'portfolio, full-stack developer, React, Node.js, Ruby, Ruby on Rails, Next.js, front-end developer, back-end developer, software engineer',
  image: 'https://cdn.sanity.io/images/n5aosvhy/production/0b4eb353efbd838adcbaaea22e49369eeeef6cd3-2019x2560.png',
  url: 'https://github.com/christianonoh',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} bg-zinc-900 text-white`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
