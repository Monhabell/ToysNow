// src/app/api/productos/route.ts
import { details } from 'framer-motion/client'
import { NextResponse } from 'next/server'
import { BiCategory } from 'react-icons/bi'
const productos = [
  {
    "id": 2, 
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
        "#",
        "#"
    ],
    "categories": [
        {"id": 2, "name": "consoladores"}, 
        {"id": 5, "name": "lubricantes"}
    ],
    "subcategories": [
        {"id": 985, "name": "Nepe pequeño"},
        {"id": 85, "name": "Aja"}
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
                "date": "14/04/2025",
            }
        ] //Ordenado mas reciente al mas antiguo
    },
    "questions": [
        {"user_id": 5,"question": "Por que tan caro", "answer": "Algo", "is_approved": false, "created_at": "14/04/2025"},
        {"user_id": 4, "question": "Por que tan barato", "answer": "Por que si", "is_approved": true, "created_at": "14/04/2025"}
    ],
    "seo": {
        "meta_title": "Nepe - Tienda de Juguetes",
        "meta_description": "Descripción para motores de búsqueda",
        "keywords": ["nepe", "juguete adulto"]
    },
    "created_at": "14/04/2025"
  },
  {
    id: 2,
    name: 'Moderno Sofá Seccional de Lujo',
    price: 32000,
    compare_price: 55000,
    description: "Sofá de 3 plazas",
    features: [
      {
        color: null,
        size: null
      }
    ],
    img: [
      '/images/productos/producto2.1.jpg',
      '/images/productos/producto2-1.jpg',
      '/images/productos/producto2-2.jpg'
    ],
    categories: ["Sofá", "Bodys", "Cama"],
    subcategories: [
      { id: 3, name: "Tela Premium" },
      { id: 4, name: "Bodys" }
    ],
    qualification: {
      count_users: {
        "5": 0,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "Muebles&Co",
    stock: 12,
    shipment: 5000,
    is_available: true,
    questions: [],
    created_at: "12/03/2025"
  },
  {
    id: 3,
    name: 'Silla Ergonómica Oficina Bodys',
    price: 80000,
    compare_price: 95000,
    description: "Silla para escritorio",
    features: [
      {
        color: null,
        size: null
      }
    ],
    img: [
      '/images/productos/producto3.jpg',
      'https://acdn-us.mitiendanube.com/stores/001/028/736/products/311-107fd26361feaa1fb816837340135185-1024-1024.jpg'
    ],
    categories: ["Sillas"],
    subcategories: [
      { id: 5, name: "Respaldo Lumbar" },
      { id: 6, name: "Ajuste de Altura" }
    ],
    qualification: {
      count_users: {
        "5": 1,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "ErgoStyle",
    stock: 30,
    shipment: 0,
    is_available: true,
    questions: [],
    created_at: "05/02/2025"
  },
  {
    id: 4,
    name: 'Mesa de Centro Minimalista Roble',
    price: 120000,
    compare_price: 0,
    description: "Mesa central para sala",
    features: [
      {
        color: null,
        size: null
      }
    ],
    img: [
      '/images/productos/producto4.jpg',
      '/images/productos/producto4-1.jpg'
    ],
    categories: ["Mesas"],
    subcategories: [
      { id: 7, name: "Madera Roble" },
      { id: 8, name: "Acabado Mate" }
    ],
    qualification: {
      count_users: {
        "5": 0,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "WoodStyle",
    stock: 8,
    shipment: "gratis",
    is_available: true,
    questions: [],
    created_at: "28/01/2025"
  },
  {
    id: 5,
    name: 'Escritorio Modular Espacio Reducido',
    price: 95000,
    compare_price: 0,
    description: "Ideal para Home Office",
    features: [
      {
        color: null,
        size: null
      }
    ],
    img: [
      '/images/productos/producto5.1.jpg',
      '/images/productos/producto5-1.jpg'
    ],
    categories: ["Bodys"],
    subcategories: [
      { id: 9, name: "Compacto" },
      { id: 10, name: "Resistente" }
    ],
    qualification: {
      count_users: {
        "5": 0,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "DecoSmart",
    stock: 25,
    shipment: "pago",
    is_available: true,
    questions: [],
    created_at: "10/01/2025"
  },
  {
    id: 6,
    name: 'Colchón Ortopédico Queen Size',
    price: 450000,
    compare_price: 520000,
    description: "Colchón anatómico de alta densidad",
    features: [
      {
        color: null,
        size: {
          Queen: {
            price: 450000,
            images: ['/images/productos/producto6.jpg']
          },
          King: {
            price: 550000,
            images: ['/images/productos/producto6-1.jpg']
          }
        }
      }
    ],
    img: [
      '/images/productos/producto6.jpg',
      '/images/productos/producto6-1.jpg'
    ],
    categories: ["Colchones"],
    subcategories: [
      { id: 11, name: "Antibacterial" },
      { id: 12, name: "Doble Cara" }
    ],
    qualification: {
      count_users: {
        "5": 1,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "DreamSleep",
    stock: 15,
    shipment: "gratis",
    is_available: true,
    questions: [],
    created_at: "21/12/2024"
  },
  {
    id: 7,
    name: 'Lámpara LED de Pie con Regulador',
    price: 40000,
    compare_price: 0,
    description: "Lámpara moderna para sala o habitación",
    features: [
      {
        color: {
          Blanco: {
            price: 40000,
            images: ['/images/productos/producto7.jpg']
          },
          Negro: {
            price: 42000,
            images: ['/images/productos/producto7-1.jpg']
          }
        }
      }
    ],
    img: [
      '/images/productos/producto7.jpg',
      '/images/productos/producto7-1.jpg'
    ],
    categories: ["Iluminación"],
    subcategories: [
      { id: 13, name: "Luz Cálida" },
      { id: 14, name: "Consumo Bajo" }
    ],
    qualification: {
      count_users: {
        "5": 0,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "LightArt",
    stock: 50,
    shipment: "pago",
    is_available: true,
    questions: [],
    created_at: "08/12/2024"
  },
  {
    id: 8,
    name: 'Comedor 4 Puestos Madera Maciza',
    price: 220000,
    compare_price: 0,
    description: "Mesa con 4 sillas",
    features: [
      {
        color: null,
        size: null
      }
    ],
    img: [
      '/images/productos/producto8.jpg',
      '/images/productos/producto8-1.jpg'
    ],
    categories: ["Comedores"],
    subcategories: [
      { id: 15, name: "Madera Natural" },
      { id: 16, name: "Acabado Pulido" }
    ],
    qualification: {
      count_users: {
        "5": 1,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "CasaFina",
    stock: 10,
    shipment: "gratis",
    is_available: true,
    questions: [],
    created_at: "01/12/2024"
  },
  {
    id: 9,
    name: 'Silla Gamer Ergonómica',
    price: 180000,
    compare_price: 0,
    description: "Para largas jornadas de juego",
    features: [
      {
        color: {
          Negro: {
            price: 180000,
            images: ['/images/productos/producto9.jpg']
          },
          Rojo: {
            price: 185000,
            images: ['/images/productos/producto9-1.jpg']
          }
        }
      }
    ],
    img: [
      '/images/productos/producto9.jpg',
      '/images/productos/producto9-1.jpg'
    ],
    categories: ["Sillas"],
    subcategories: [
      { id: 17, name: "Reclinable" },
      { id: 18, name: "Reposabrazos 4D" }
    ],
    qualification: {
      count_users: {
        "5": 1,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "GameZone",
    stock: 18,
    shipment: "pago",
    is_available: true,
    questions: [],
    created_at: "17/11/2024"
  },
  {
    id: 10,
    name: 'Closet Modular Armable',
    price: 110000,
    compare_price: 0,
    description: "Fácil de armar, resistente",
    features: [
      {
        color: null,
        size: {
          Pequeño: {
            price: 110000,
            images: ['/images/productos/producto10.jpg']
          },
          Grande: {
            price: 150000,
            images: ['/images/productos/producto10-1.jpg']
          }
        }
      }
    ],
    img: [
      '/images/productos/producto10.jpg',
      '/images/productos/producto10-1.jpg'
    ],
    categories: ["Closets"],
    subcategories: [
      { id: 19, name: "Modular" },
      { id: 20, name: "Multi compartimentos" }
    ],
    qualification: {
      count_users: {
        "5": 0,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      },
      comments: []
    },
    brand: "OrganizaTodo",
    stock: 13,
    shipment: "pago",
    is_available: true,
    questions: [],
    created_at: "05/11/2024"
  }
];


export async function GET() {
  return NextResponse.json(productos)
}
