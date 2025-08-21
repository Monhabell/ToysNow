import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | ToysNow',
  robots: {
    index: false,
  },
}

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
