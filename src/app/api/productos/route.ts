// src/app/api/productos/route.ts
import { details } from 'framer-motion/client'
import { NextResponse } from 'next/server'
import { BiCategory } from 'react-icons/bi'
const productos = [
  {
    "id": 1,
    "name": "Nepe",
    "price": 10000,
    "compare_price": 10000,
    "slug": "nepe-1000",
    "description": "aadadasdasdasdasd",
    "brand": "Algo",
    "stock": 6,
    "shipment": 10000,
    "is_available": true,
    "is_feature": true,
    "features": [
      {
        "variants": [
          {
            "color": "red",
            "size": "Sm",
            "weight": "15kg",
            "cost_shipping": 100232,
            "dimensions": "4x112",
            "price": 120000,
            "compare_price": 150000,
            "stock": 12,
            "images": []
          },
          {
            "color": "blue",
            "price": 31321,
            "compare_price": 150000,
            "stock": 21,
            "images": []
          },
          {
            "size": "XXL",
            "price": 31321,
            "compare_price": 150000,
            "stock": 21,
            "images": []
          }
        ]
      }
    ],
    "img": [
      "/images/productos/producto2.1.jpg",
      "/images/productos/producto2-1.jpg",
      "/images/productos/producto2-2.jpg"
    ],
    "categories": [
      { "id": 2, "name": "consoladores" },
      { "id": 5, "name": "lubricantes" }
    ],
    "subcategories": [
      { "id": 985, "name": "Nepe pequeño" },
      { "id": 85, "name": "Aja" }
    ],
    "qualification": {
      "count_users": {
        "5": 20,
        "4": 10,
        "3": 5,
        "2": 1,
        "1": 25
      },
      "comments": [
        {
          "text": "Muy bueno",
          "date": "14/04/2025"
        }
      ]
    },
    "questions": [
      {
        "user_id": 5,
        "question": "Por qué tan caro",
        "answer": "Algo",
        "is_approved": true,
        "created_at": "14/04/2025"
      },
      {
        "user_id": 4,
        "question": "Por qué tan barato",
        "answer": "Por que sí",
        "is_approved": true,
        "created_at": "14/04/2025"
      }
    ],
    "seo": {
      "meta_title": "Nepe - Tienda de Juguetes",
      "meta_description": "Descripción para motores de búsqueda",
      "keywords": ["nepe", "juguete adulto"]
    },
    "created_at": "14/04/2025"
  },

  // Copias con diferencias para los demás productos:
  {
    "id": 2,
    "name": "Dildo Master 3000",
    "price": 23000,
    "compare_price": 25000,
    "slug": "dildo-master-3000",
    "description": "Un producto potente para grandes momentos.",
    "brand": "XSensual",
    "stock": 10,
    "shipment": 12000,
    "is_available": true,
    "is_feature": true,
    "features": [
      {
        "variants": [
          {
            "color": "black",
            "size": "L",
            "price": 23000,
            "compare_price": 25000,
            "stock": 10,
            "images": []
          }
        ]
      }
    ],
    "img": ["/images/productos/dildo1.jpg"],
    "categories": [{ "id": 2, "name": "consoladores" }],
    "subcategories": [{ "id": 986, "name": "Estándar" }],
    "qualification": {
      "count_users": { "5": 5, "4": 2, "3": 0, "2": 0, "1": 1 },
      "comments": [{ "text": "Excelente calidad", "date": "12/03/2025" }]
    },
    "questions": [],
    "seo": {
      "meta_title": "Dildo Master 3000 - Placer Supremo",
      "meta_description": "Descubre el Dildo Master 3000, el juguete definitivo.",
      "keywords": ["dildo", "juguete"]
    },
    "created_at": "12/03/2025"
  },

  {
    "id": 3,
    "name": "Lubricante Mágico",
    "price": 8000,
    "compare_price": 10000,
    "slug": "lubricante-magico",
    "description": "Ideal para todo tipo de momentos íntimos.",
    "brand": "Lubrix",
    "stock": 50,
    "shipment": 4000,
    "is_available": true,
    "is_feature": false,
    "features": [],
    "dimensions": "4x112",
    "size": "Sm",
    "weight": "15kg",
    "img": ["/images/productos/lubricante1.jpg"],
    "categories": [{ "id": 5, "name": "lubricantes" }],
    "subcategories": [],
    "qualification": {
      "count_users": { "5": 10, "4": 8, "3": 2, "2": 0, "1": 0 },
      "comments": [{ "text": "Muy suave y duradero", "date": "01/05/2025" }]
    },
    "questions": [],
    "seo": {
      "meta_title": "Lubricante Mágico - Suavidad Total",
      "meta_description": "Lubricante ideal para el placer.",
      "keywords": ["lubricante", "intimidad"]
    },
    "created_at": "01/05/2025"
  },

]
  ;


export async function GET() {
  return NextResponse.json(productos)
}
