import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Softgenix Ecommerce',
  description: 'Tienda virtual desarrollada con Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
