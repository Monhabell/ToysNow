export type Image = {
  id: number
  product_id: number
  url: string
}

export type Variant = {
  cost_shipping: number
  color?: string;
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
  qualification?: Qualification;
  brand: Brand
  variants: Variant[]
  images: Image[]
  categories: Category[] // Usa el tipo Category definido arriba

  reviews_count: number
  created_at: string
  updated_at: string
  seo: SEO
  features: Feature[];
  shipment: number
  reviews: Review[];

}

interface Review {
  id: number;
  comment: string;
  rating?: number;
  user_name?: string;
  created_at?: string;
}


export type Qualification = {
  count_users: {
    [key: string]: number;
  };
  comments: {
    text: string;
    date: string;
  }[];
}

interface Feature {
  variants: Variant[];
}


export type ApiResponse = {
  data: Producto
}

