import { NextResponse } from 'next/server'

 const banner = [
        {
            "image": "/images/Banners/1.webp",
            "type": "alert",
            "payload": "Banner 1: mensaje simple"
        },
        {
            "image": "/images/Banners/2.webp",
            "type": "alert",
            "payload": "ofertas"
        },
        {
            "image": "/images/Banners/3.webp",
            "type": "internal",
            "payload": "nuevos"
        },
        {
            "image": "/images/Banners/4.webp",
            "type": "external",
            "payload": "https://www.gesiapp.com.co"
        },
        {
            "image": "/images/Banners/5.webp",
            "type": "whatsapp",
            "payload": "573202371520"
        }
    ]
    
    export async function GET() {
        try {
            return NextResponse.json(banner, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } catch (error) {
            return NextResponse.json(
                { error: 'Error al obtener categorías' },
                { status: 500 }
            )
        }
    }