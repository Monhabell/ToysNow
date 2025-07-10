type Producto = {
  id: string | number
  name: string
  price: number | string
  compare_price?: number | string
  stock?: number
  images?: { id: number, product_id: number, url: string }[]  // Cambiado de img a images
  created_at?: string | Date
  qualification?: number
  relevance?: number
  slug?: string | null
  description?: string
  brand?: { id: number, name: string }
  categories?: Array<{name: string, slug: string, description: string | null, image: string | null, parent_id: number | null}>
}
  
  // interface ListaProductosProps {
  //   productos: Producto[];
  //   isSlider?: boolean;
  // }