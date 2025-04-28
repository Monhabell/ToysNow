// app/api/categorias/route.js
import { NextResponse } from 'next/server'

// Datos de ejemplo basados en tu estructura
const categorias = [
    {
      id: 1,
      name: "Juguetes para Adultos",
      subcategory_id: [
        { id: 101, name: "Vibradores" },
        { id: 102, name: "Dildos" },
        { id: 103, name: "Bolas Chinas" },
        { id: 104, name: "Bolas Chinas" },
        { id: 105, name: "Bolas Chinas" },
        { id: 106, name: "Bolas Chinas" },
      ],
      img: "/images/productos/juguetes_adultos.jpg",
      slug: "sexshop/juguetes-para-adultos",
    },
    {
      id: 2,
      name: "Lencería Erótica",
      subcategory_id: [
        { id: 201, name: "Bodys" },
        { id: 202, name: "Conjuntos de Lencería" },
        { id: 203, name: "Medias y Ligueros" },
      ],
      img: "/images/productos/lenceria_erotica.jpg",
      slug: "sexshop/lenceria-erotica",
    },
    {
      id: 3,
      name: "Accesorios BDSM",
      subcategory_id: [
        { id: 301, name: "Esposas y Ataduras" },
        { id: 302, name: "Antifaces y Mordazas" },
        { id: 303, name: "Fustas y Látigos" },
      ],
      img: "/images/productos/accesorios_bdsm.jpg",
      slug: "sexshop/accesorios-bdsm",
    },
    {
      id: 4,
      name: "Lubricantes y Cosmética Íntima",
      subcategory_id: [
        { id: 401, name: "Lubricantes a Base de Agua" },
        { id: 402, name: "Lubricantes con Sabor" },
        { id: 403, name: "Aceites de Masaje" },
      ],
      img: "/images/productos/lubricantes.jpg",
      slug: "sexshop/lubricantes-cosmetica",
    },
    {
      id: 5,
      name: "Anillos y Plugs Anales",
      subcategory_id: [
        { id: 501, name: "Anillos para el Pene" },
        { id: 502, name: "Plugs Anales" },
        { id: 503, name: "Kits de Iniciación" },
      ],
      img: "/images/productos/anillos_plugs.jpg",
      slug: "sexshop/anillos-plugs-anales",
    }
  ];
  

export async function GET() {
    try {
        return NextResponse.json(categorias, {
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