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
  url: 'https://johndoe.com',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-zinc-900 text-white`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
