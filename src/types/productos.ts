export type Image = {
  id: number
  product_id: number
  url: string
}

export type Variant = {
  id: number
  price: string | null
  stock: number
  is_available: boolean
  compare_price: string | null
  quantity: number
  shipment: string | null
  attributes: Array<{
    id: number
    name: string
    value: string
  }>
}

export type Brand = {
  id: number
  name: string
}

export type SEO = {
  title: string | null
  description: string | null
  keywords: string | null
}

export type Category = {
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: number | null // Asegúrate que esta propiedad esté incluida
}

export type Producto = {
  id: number
  name: string
  slug: string | null
  description: string
  price: string
  compare_price: string | null
  quantity: number
  stock: number
  is_available: boolean
  is_feature: boolean
  relevance: number
  qualification: number
  brand: Brand
  variants: Variant[]
  images: Image[]
  categories: Category[] // Usa el tipo Category definido arriba
  reviews: any[]
  reviews_count: number
  created_at: string
  updated_at: string
  seo: SEO
}

export type ApiResponse = {
  data: Producto
}