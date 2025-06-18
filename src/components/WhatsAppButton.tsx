'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function WhatsAppButton() {
  const phoneNumber = '1234567890' // Reemplaza con tu número
  const message = 'Hola, me gustaría obtener más información sobre sus productos.'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <span className="ml-2 bg-white text-[#075E54] px-3 py-1 rounded-lg shadow-md hidden md:block animate-pulse">
            ¡Chatea con nosotros!
        </span>
        <Link
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[] hover:bg-[#128C7E] text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Chat en WhatsApp"
        >
            {/* Usando el logo oficial de WhatsApp */}
            <Image 
            src="/images/icons/whatsapp.png" 
            alt="WhatsApp" 
            width={44} 
            height={44}
            className="w-10 h-10"
            />
            <span className="sr-only">WhatsApp</span>
        </Link>
      
    </div>
  )
}