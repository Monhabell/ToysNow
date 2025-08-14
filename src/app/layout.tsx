import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'ToysNow - Tienda Erótica Premium',
    template: '%s | ToysNow'
  },
  description: 'ToysNow es una tienda virtual que ofrece productos para adultos con fines de bienestar y placer sexual. Operamos desde Colombia, con atención personalizada a través de nuestras plataformas digitales',
  keywords: ['juguetes eróticos', 'tienda sexual', 'productos para adultos', 'lencería sexy', 'vibradores', 'ToysNow'],
  icons: {
    icon: '/images/logos/icono-logo-toys.ico',
  },
  openGraph: {
    title: 'ToysNow - Tienda Erótica Premium',
    description: 'Explora nuestra colección de productos eróticos diseñados para potenciar tu intimidad. Envío discreto y garantía de satisfacción.',
    url: 'https://www.toysnow.com.co',
    siteName: 'ToysNow',
    images: [
      {
        url: '/images/logos/icono_toysnow.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToysNow - Tienda Erótica Premium',
    description: 'Descubre productos que transformarán tu vida íntima. Envío discreto y garantía de calidad.',
    images: ['/images/twitter-image.jpg'],
  },
  verification: {
    google: 'X_T0lOIJ4i2qyF4yYUStziUnAYuC9u1r7snzmUuDb9Q' 
  }
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