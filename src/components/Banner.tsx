'use client'
import { useEffect, useState } from 'react'
import '../styles/banner.css'

const bannerData = [
  "/images/Banners/1000231530.png"
]

export default function Banner() {
  const extendedData = [bannerData[bannerData.length - 1], ...bannerData, bannerData[0]] // [last, real images..., first]
  const [currentIndex, setCurrentIndex] = useState(1) // Arrancamos en la posición 1
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
      const interval = setInterval(() => {
        goToNext()
      }, 7000)
      return () => clearInterval(interval)
    }
  }, []) // solo una vez al montar

  // Esto detecta cuando llegas a clones
  const handleTransitionEnd = () => {
    if (currentIndex === extendedData.length - 1) {
      // Si es el clon de la primera imagen, salta al real
      setIsTransitioning(false)
      setCurrentIndex(1)
    }
    if (currentIndex === 0) {
      // Si es el clon de la última imagen, salta al real
      setIsTransitioning(false)
      setCurrentIndex(extendedData.length - 2)
    }
  }

  return (
    <div className="banner_publicitario overflow-hidden">
      <div
        className="banner_slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedData.map((image, index) => (
          <img key={index} src={image} alt={`Banner ${index}`} className="banner_image" />
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
