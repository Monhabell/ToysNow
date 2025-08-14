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
    // Favicons estáticos (ICO/PNG)
    icon: [
      { url: '/images/logos/icon/favicon.ico' }, // Formato ICO tradicional
      { url: '/images/logos/icon/favicon-96x96.png', sizes: '96x96', type: 'image/png' }, // Para navegadores modernos
      { url: '/images/logos/icon/favicon.svg', type: 'image/svg+xml' }, // SVG (opcional)
    ],
    // Apple Touch Icon (iOS)
    apple: '/images/logos/icon/apple-touch-icon.png',
    // WebApp Manifest (PWA)
    other: [
      {
        rel: 'manifest',
        url: '/images/logos/site.webmanifest',
      },
    ],
  },
  openGraph: {
    title: 'ToysNow - Tienda Erótica Premium',
    description: 'Explora nuestra colección de productos eróticos diseñados para potenciar tu intimidad. Envío discreto y garantía de satisfacción.',
    url: 'https://www.toysnow.com.co',
    siteName: 'ToysNow',
    images: [
      {
        url: '/images/logos/icono_toysnow.jpg', // Asegúrate de tener esta imagen
        width: 1200,
        height: 630,
        alt: 'ToysNow - Productos eróticos premium',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToysNow - Tienda Erótica Premium',
    description: 'Descubre productos que transformarán tu vida íntima. Envío discreto y garantía de calidad.',
    images: ['/images/logos/ticono_toysnow.jpg'], // Asegúrate de tener esta imagen
  },
  verification: {
    google: 'X_T0lOIJ4i2qyF4yYUStziUnAYuC9u1r7snzmUuDb9Q' 
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Preconexión para mejorar rendimiento */}
        <link rel="preconnect" href="https://www.toysnow.com.co" />
        {/* Preload del favicon */}
        <link rel="preload" href="/images/logos/icon/favicon.ico" as="image" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </CartProvider>
      </body>
    </html>
  )
}