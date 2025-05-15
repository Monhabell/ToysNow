// src/app/api/productos/route.ts
import { details } from 'framer-motion/client'
import { NextResponse } from 'next/server'
import { BiCategory } from 'react-icons/bi'
const productos = [
  { 
    id: 1, 
    name: 'Dados eóticos Liminosos de 6 caras', 
    price: 100000, 
    compare_price: 0, 
    description: "Cama doble",
    stock: 2,
    is_feature: ['Cama plus', 'Cómoda'],
    img: ['/images/productos/producto.jpg', '/images/productos/producto1-1.jpg', '/images/productos/producto1-2.jpg'],
    quialification: null,
    category: ['Cama', 'Dobles'],
    brand: "Telaquito",
    shipment: 5000,
    is_available: true, // no mostrsrlo o mostrlo pero como no disponible
    created_at: "12/03/2025",
    color: ["red", "blue", "Orange"],
    destacado: 1
  },
  { 
    id: 2, 
    name: 'Moderno Sofá Seccional de Lujo', 
    price: 32000, 
    compare_price: 55000, 
    description: "Sofá de 3 plazas",
    stock: 12,
    is_feature: ['Tela Premium', 'Bodys'],
    img: ['/images/productos/producto2.1.jpg', '/images/productos/producto2-1.jpg', '/images/productos/producto2-2.jpg'],
    quialification: 4,
    category: ['Sofá', 'Bodys'],
    brand: "Muebles&Co",
    shipment: 5000,
    created_at: "12/03/2025",
    destacado: 0,
    color: null,


  },
  { 
    id: 3, 
    name: 'Silla Ergonómica Oficina Bodys', 
    price: 80000, 
    compare_price: 95000, 
    description: "Silla para escritorio",
    stock: 30,
    is_feature: ['Respaldo Lumbar', 'Ajuste de Altura'],
    img: ['/images/productos/producto3.jpg', 'https://acdn-us.mitiendanube.com/stores/001/028/736/products/311-107fd26361feaa1fb816837340135185-1024-1024.jpg'],
    quialification: 5,
    category: ['Sillas'],
    brand: "ErgoStyle",
    shipment: 0,
    created_at: "05/02/2025",
    destacado: 1

  },
  { 
    id: 4, 
    name: 'Mesa de Centro Minimalista Roble', 
    price: 120000, 
    compare_price: 0, 
    description: "Mesa central para sala",
    stock: 8,
    is_feature: ['Madera Roble', 'Acabado Mate'],
    img: ['/images/productos/producto4.jpg', '/images/productos/producto4-1.jpg'],
    quialification: 4,
    category: ['Mesas'],
    brand: "WoodStyle",
    shipment: "gratis",
    created_at: "28/01/2025",
    destacado: 0
    
  },
  { 
    id: 5, 
    name: 'Escritorio Modular Espacio Reducido', 
    price: 95000, 
    compare_price: 0, 
    description: "Ideal para Home Office",
    stock: 25,
    is_feature: ['Compacto', 'Resistente'],
    img: ['/images/productos/producto5.1.jpg', '/images/productos/producto5-1.jpg'],
    quialification: 4,
    category: ['Bodys'],
    brand: "DecoSmart",
    shipment: "pago",
    created_at: "10/01/2025",
    destacado: 0

  },
  { 
    id: 6, 
    name: 'Colchón Ortopédico Queen Size', 
    price: 450000, 
    compare_price: 520000, 
    description: "Colchón anatómico de alta densidad",
    stock: 15,
    is_feature: ['Antibacterial', 'Doble Cara'],
    img: ['/images/productos/producto6.jpg', '/images/productos/producto6-1.jpg'],
    quialification: 5,
    category: ['Colchones'],
    brand: "DreamSleep",
    shipment: "gratis",
    created_at: "21/12/2024",
    destacado: 0

  },
  { 
    id: 7, 
    name: 'Lámpara LED de Pie con Regulador', 
    price: 40000, 
    compare_price: 0, 
    description: "Lámpara moderna para sala o habitación",
    stock: 50,
    is_feature: ['Luz Cálida', 'Consumo Bajo'],
    img: ['/images/productos/producto7.jpg', '/images/productos/producto7-1.jpg'],
    quialification: 4,
    category: ['Iluminación'],
    brand: "LightArt",
    shipment: "pago",
    created_at: "08/12/2024",
    destacado: 0

  },
  { 
    id: 8, 
    name: 'Comedor 4 Puestos Madera Maciza', 
    price: 220000, 
    compare_price: 0, 
    description: "Mesa con 4 sillas",
    stock: 10,
    is_feature: ['Madera Natural', 'Acabado Pulido'],
    img: ['/images/productos/producto8.jpg', '/images/productos/producto8-1.jpg'],
    quialification: 5,
    category: ['Comedores'],
    brand: "CasaFina",
    shipment: "gratis",
    created_at: "01/12/2024",
    destacado: 0

  },
  { 
    id: 9, 
    name: 'Silla Gamer Ergonómica', 
    price: 180000, 
    compare_price: 0, 
    description: "Para largas jornadas de juego",
    stock: 18,
    is_feature: ['Reclinable', 'Reposabrazos 4D'],
    img: ['/images/productos/producto9.jpg', '/images/productos/producto9-1.jpg'],
    quialification: 5,
    category: ['Sillas'],
    brand: "GameZone",
    shipment: "pago",
    created_at: "17/11/2024",
    destacado: 0

  },
  { 
    id: 10, 
    name: 'Closet Modular Armable', 
    price: 110000, 
    compare_price: 0, 
    description: "Fácil de armar, resistente",
    stock: 13,
    is_feature: ['Modular', 'Multi compartimentos'],
    img: ['/images/productos/producto10.jpg', '/images/productos/producto10-1.jpg'],
    quialification: 4,
    category: ['Closets'],
    brand: "OrganizaTodo",
    shipment: "pago",
    created_at: "05/11/2024",
    destacado: 0

  },
  { 
    id: 11, 
    name: 'Mesa Auxiliar Redonda Vintage', 
    price: 75000, 
    compare_price: 0, 
    description: "Ideal para salas o estudios",
    stock: 22,
    is_feature: ['Estilo Retro', 'Patas de Metal'],
    img: ['/images/productos/producto11.jpg', '/images/productos/producto11-1.jpg'],
    quialification: 4,
    category: ['Mesas', 'yo'],
    brand: "VintageHome",
    shipment: "gratis",
    created_at: "25/10/2024",
    destacado: 0

  },
  { 
    id: 12, 
    name: 'Alfombra Antideslizante Premium', 
    price: 65000, 
    compare_price: 0, 
    description: "Suave al tacto y lavable",
    stock: 40,
    is_feature: ['Antideslizante', 'Hipoalergénica'],
    img: ['/images/productos/producto12.jpg', '/images/productos/producto12-1.jpg'],
    quialification: 5,
    category: ['Decoración', 'Alfombras', 'yo'],
    brand: "DecoStyle",
    shipment: "pago",
    created_at: "12/10/2024",
    destacado: 0

  },
  { 
    id: 13, 
    name: 'Zapatero de Madera Minimalista', 
    price: 90000, 
    compare_price: 0, 
    description: "Organiza hasta 20 pares de zapatos",
    stock: 14,
    is_feature: ['Fácil Montaje', 'Espacio Optimizado'],
    img: ['/images/productos/producto13.jpg', '/images/productos/producto13-1.jpg'],
    quialification: 4,
    category: ['Organización'],
    brand: "MuebleFácil",
    shipment: "gratis",
    created_at: "28/09/2024",
    destacado: 0

  },
  { 
    id: 14, 
    name: 'Juego de Jardín 3 Piezas Rattan', 
    price: 300000, 
    compare_price: 0, 
    description: "Perfecto para exteriores",
    stock: 6,
    is_feature: ['Resistente al Agua', 'Incluye Cojines'],
    img: ['/images/productos/producto14.jpg', '/images/productos/producto14-1.jpg'],
    quialification: 5,
    category: ['Exteriores', 'yo'],
    brand: "GardenPlus",
    shipment: "gratis",
    created_at: "15/09/2024",
    destacado: 0

  },
  { 
    id: 15, 
    name: 'Librero Vertical de 6 Niveles', 
    price: 105000, 
    compare_price: 0, 
    description: "Ideal para libros y decoración",
    stock: 19,
    is_feature: ['Material MDF', 'Acabado Madera'],
    img: ['/images/productos/producto15.jpg', '/images/productos/producto15-1.jpg'],
    quialification: 4,
    category: ['Estanterías', 'yo'],
    brand: "BookSmart",
    shipment: "pago",
    created_at: "01/09/2024",
    destacado: 0

  }
];


export async function GET() {
  return NextResponse.json(productos)
}
