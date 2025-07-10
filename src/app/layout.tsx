import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'
const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'ToysNow',
  description: 'Tienda erotica descubre una amplia selección de productos a precios inugualables. ¡déjate llevar por la imaginación y rompe con la monotonía!  ',
  icons: {
    icon: '/images/logos/icono-logo-toys.ico', 
  },
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
