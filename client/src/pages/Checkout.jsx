import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { ordersApi } from '../api'

function Checkout() {
  const { cart, fetchCart, total } = useContext(CartContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cart.length === 0) {
      fetchCart()
    }
  }, [cart.length, fetchCart])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      const shippingAddress = `${formData.name}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
      
      const res = await ordersApi.create({ shipping_address: shippingAddress })
      
      if (res.success) {
        await fetchCart()
        navigate(`/order-confirmation/${res.data.id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded mt-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id || item.product_id} className="flex justify-between py-2 border-b">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout