'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Producto = {
  id: number
  name: string
  price: number
  compare_price: number
  img: string
  stock: number
  color: string
  shipment: number // Costo de envío
}

type ProductoEnCarrito = Producto & { cantidad: number }

type CartContextType = {
  carrito: ProductoEnCarrito[]
  agregarProducto: (producto: Producto) => void
  eliminarProducto: (id: number) => void
  aumentarCantidad: (id: number) => void
  disminuirCantidad: (id: number) => void
  calcularSubtotal: () => number
  calcularEnvioTotal: () => number
  calcularTotalFinal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([])

  const agregarProducto = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: Math.min(p.cantidad + 1, p.stock) }
            : p
        )
      } else {
        return [...prev, { ...producto, cantidad: 1 }]
      }
    })
  }

  const eliminarProducto = (id: number) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const aumentarCantidad = (id: number) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, cantidad: Math.min(p.cantidad + 1, p.stock) }
          : p
      )
    )
  }

  const disminuirCantidad = (id: number) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, cantidad: Math.max(1, p.cantidad - 1) }
          : p
      )
    )
  }

  const calcularSubtotal = () => {
    return carrito.reduce((total, producto) => total + producto.price * producto.cantidad, 0)
  }

  const calcularEnvioTotal = () => {
    const subtotal = calcularSubtotal()
    if (subtotal > 500000) {
      return 0
    } else {
      return carrito.reduce(
        (total, producto) => total + (producto.shipment > 0 ? producto.shipment * producto.cantidad : 0),
        0
      )
    }
  }

  const calcularTotalFinal = () => {
    return calcularSubtotal() + calcularEnvioTotal()
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        aumentarCantidad,
        disminuirCantidad,
        calcularSubtotal,
        calcularEnvioTotal,
        calcularTotalFinal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}