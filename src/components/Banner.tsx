'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import '../styles/banner.css'

type BannerItem = {
  image: string;
  type: 'alert' | 'internal' | 'external' | 'whatsapp';
  payload: string;
};

export default function Banner() {
  const router = useRouter()
  const [bannerData, setBannerData] = useState<BannerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del banner
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/banner')
        if (!response.ok) throw new Error('Error al cargar banners')
        const data = await response.json()
        setBannerData(data)
      } catch (err) {
        console.error('Error:', err)
        setError('No se pudieron cargar los banners')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  // Manejar clic en el banner
  const handleClick = (item: BannerItem) => {
    if (!item) return

    switch (item.type) {
      case 'alert':
        alert(item.payload)
        break
      case 'internal':
        router.push(`/productos?buscar=${encodeURIComponent(item.payload)}`)
        break
      case 'external':
        window.open(item.payload, '_blank', 'noopener,noreferrer')
        break
      case 'whatsapp':
        window.open(`https://wa.me/${item.payload}`, '_blank', 'noopener,noreferrer')
        break
      default:
        console.warn('Tipo de acción desconocido:', item.type)
    }
  }

  if (isLoading) return <div className="banner_publicitario banner-loading">Cargando...</div>
  if (error) return <div className="banner_publicitario banner-error">{error}</div>
  if (bannerData.length === 0) return <div className="banner_publicitario banner-empty">No hay banners disponibles</div>

  return (
    <div className="banner_publicitario w-full">
      <Carousel 
        opts={{
          loop: true,
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {bannerData.map((item, index) => (
            <CarouselItem key={`banner-${index}`} className="basis-full">
              <div 
                className="w-full cursor-pointer"
                onClick={() => handleClick(item)}
              >
                <Image 
                  src={item.image} 
                  alt={`Banner ${index}`} 
                  className="banner_image w-full" 
                  width={2200}
                  height={700}
                  priority={index === 0}
                  unoptimized={process.env.NODE_ENV === 'development'}
                  onError={(e) => {
                    console.error('Error al cargar imagen:', item.image)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {bannerData.length > 1 && (
          <>
            <CarouselPrevious className="z-80 banner-button left" />
            <CarouselNext className="z-80 banner-button right" />
          </>
        )}
      </Carousel>
    </div>
  )
}