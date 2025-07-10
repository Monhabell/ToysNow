'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import '../styles/banner.css'

type BannerItem = {
  image: string;
  type: 'alert' | 'internal' | 'external' | 'whatsapp';
  payload: string;
};

export default function Banner() {
  const router = useRouter()
  const [bannerData, setBannerData] = useState<BannerItem[]>([])

  useEffect(() => {
    fetch('/api/banner') // tu endpoint real aquí
      .then(res => res.json())
      .then(data => setBannerData(data))
      .catch(err => console.error('Error al cargar banners:', err))
  }, [])

  const extendedData = bannerData.length
    ? [bannerData[bannerData.length - 1], ...bannerData, bannerData[0]]
    : []

  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const goToPrevious = () => {
    setCurrentIndex(prev => prev - 1)
    setIsTransitioning(true)
  }

  const goToNext = () => {
    setCurrentIndex(prev => prev + 1)
    setIsTransitioning(true)
  }

  useEffect(() => {
    if (bannerData.length > 1) {
      const interval = setInterval(goToNext, 5000)
      return () => clearInterval(interval)
    }
  }, [bannerData])

  const handleTransitionEnd = () => {
    if (currentIndex === extendedData.length - 1) {
      setIsTransitioning(false)
      setCurrentIndex(1)
    } else if (currentIndex === 0) {
      setIsTransitioning(false)
      setCurrentIndex(extendedData.length - 2)
    }
  }

  const realIndex = (currentIndex - 1 + bannerData.length) % bannerData.length

  const handleClick = () => {
    const item = bannerData[realIndex]
    if (!item) return

    switch (item.type) {
      case 'alert':
        alert(item.payload)
        break
      case 'internal':
        router.push(`/productos?buscar=${encodeURIComponent(item.payload)}`)
        break
      case 'external':
        window.open(item.payload, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/${item.payload}`, '_blank')
        break
      default:
        console.warn('Tipo de acción desconocido:', item.type)
    }
  }

  return (
    <div className="banner_publicitario overflow-hidden cursor-pointer">
      <div
        className="banner_slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
        onClick={handleClick}
      >
        {extendedData.map((item, index) => (
         <Image 
            key={`${item.image}-${index}-${Date.now()}`}
            src={item.image} 
            alt={`Banner ${index}`} 
            className="banner_image" 
            width={2200}
            height={700}
            priority
            unoptimized={process.env.NODE_ENV === 'development'} 
          />
        ))}
      </div>

      {bannerData.length > 1 && (
        <>
          <button className="z-80 banner-button left" onClick={goToPrevious}>❮</button>
          <button className="z-80 banner-button right" onClick={goToNext}>❯</button>
        </>
      )}
    </div>
  )
}
