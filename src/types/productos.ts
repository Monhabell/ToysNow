// En src/types/productos.ts
export type Producto = {
  id: string | number
  name: string
  price: number | string  // Acepta ambos formatos
  compare_price: string | null  // Permite null
  stock?: number
  images: Array<{
    id: number
    product_id: number
    url: string
  }>
  created_at?: string | Date
  qualification?: number
  relevance?: number
  slug?: string | null
  description?: string
  brand?: {
    id: number
    name: string
  }
  categories?: Array<{
    name: string
    slug: string
    description: string | null
    image: string | null
    parent_id: number | null
  }>
  variants?: Array<{
    id: number
    price: string | null
    stock: number
    compare_price: string | null
    shipment: number | null
    attributes: Array<{
      id: number
      name: string
      value: string
    }>
  }>
  reviews_count?: number
}