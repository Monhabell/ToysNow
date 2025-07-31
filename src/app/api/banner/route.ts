import { NextResponse } from 'next/server'

 const banner = [
        {
            "image": "/images/Banners/1.webp",
            "type": "internal",
            "payload": "Aceites"
        },
        {
            "image": "/images/Banners/2.webp",
            "type": "external",
            "payload": "https://form.typeform.com/to/kkJSsGaQ?fbclid=PAQ0xDSwL3fxNleHRuA2FlbQIxMQABp7S-a9nuXpR2r9w1R8n9F8X3Ssf2pb6utN_k_hXUPmn1tBPtzkgXILfzVIBS_aem_pdVnCGzV98kLkkUtOx5mKQ&typeform-source=l.instagram.com"
        },
        {
            "image": "/images/Banners/3.webp",
            "type": "internal",
            "payload": "plug"
        },
        {
            "image": "/images/Banners/4.webp",
            "type": "external",
            "payload": "https://www.gesiapp.com.co"
        },
        {
            "image": "/images/Banners/5.webp",
            "type": "whatsapp",
            "payload": "573114479743"
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
        } catch (e) {
            return NextResponse.json(
                { error: 'Error al obtener categorías' + e },
                { status: 500 }
            )
        }
    }