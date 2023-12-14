"use client"

import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function AnimateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
      {children}
      </div>
    </AnimatePresence>
  )
}