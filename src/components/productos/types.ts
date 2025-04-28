interface Producto {
    id: number;
    name: string;
    price: number;
    img: string;
    rating?: number;
    // Agrega más propiedades según necesites
  }
  
  interface ListaProductosProps {
    productos: Producto[];
    isSlider?: boolean;
  }