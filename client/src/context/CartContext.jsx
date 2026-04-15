import { createContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      const res = await cartApi.get()
      if (res.success) {
        setCart(res.data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true)
      await cartApi.add({ product_id: product.id, quantity })
      await fetchCart()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true)
      if (quantity === 0) {
        await cartApi.remove(productId)
      } else {
        await cartApi.update({ product_id: productId, quantity })
      }
      await fetchCart()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setLoading(true)
      await cartApi.remove(productId)
      await fetchCart()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      for (const item of cart) {
        await cartApi.remove(item.product_id)
      }
      setCart([])
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}