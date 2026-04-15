import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import CartItem from '../components/CartItem'

function Cart() {
  const { cart, loading, fetchCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleCheckout = () => {
    navigate('/checkout')
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {loading && cart.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded shadow">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-600 hover:underline text-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <CartItem key={item.id || item.product_id} item={item} />
            ))}
            
            <div className="text-right text-sm text-gray-500 mt-2">
              Cart total: ₹{total.toLocaleString('en-IN')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal ({itemCount} items)</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-4">
              <span className="font-bold text-xl">Total</span>
              <span className="font-bold text-xl">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart