'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  color?: string;
  image: string;
  stock?: number;
  shipment?: number;
  cantidad: number;
  variant?: {
    id?: number;
    attributes?: Array<{
      name: string;
      value: string;
    }>;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  agregarProducto: (producto: CartItem) => void;
  actualizarCantidad: (id: number, variantId: number | undefined, newQuantity: number) => void;
  removerProducto: (id: number, variantId: number | undefined) => void;
  limpiarCarrito: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const agregarProducto = (producto: CartItem) => {
    setCartItems(prevItems => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === producto.id && 
        (item.variant?.id === producto.variant?.id || 
         (!item.variant?.id && !producto.variant?.id))
      );

      if (existingItemIndex >= 0) {
        // Si ya existe, actualizar la cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          cantidad: updatedItems[existingItemIndex].cantidad + producto.cantidad
        };
        return updatedItems;
      } else {
        // Si no existe, agregar nuevo producto
        return [...prevItems, producto];
      }
    });
  };

  const actualizarCantidad = (id: number, variantId: number | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id && (item.variant?.id === variantId || (!item.variant?.id && !variantId))
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const removerProducto = (id: number, variantId: number | undefined) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === id && (item.variant?.id === variantId || (!item.variant?.id && !variantId)))
    ));
  };

  const limpiarCarrito = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        agregarProducto, 
        actualizarCantidad, 
        removerProducto, 
        limpiarCarrito 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};