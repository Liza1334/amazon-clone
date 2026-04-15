import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ordersApi } from '../api'

function OrderConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await ordersApi.get()
      if (res.success) {
        const foundOrder = res.data.find(o => o.id === parseInt(id))
        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          setError('Order not found')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 text-xl">{error || 'Order not found'}</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline inline-block">Go to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
        <p className="text-xl text-gray-600 mb-6">Your order has been placed successfully.</p>
        
        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-bold">#{order.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order Date:</span>
            <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Status:</span>
            <span className="text-green-600 font-medium capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-xl">₹{order.total_amount?.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        {order.items && order.items.length > 0 && (
          <div className="text-left mb-6">
            <h3 className="font-bold mb-3">Order Items:</h3>
            <div className="space-y-2">
              {order.items.filter(item => item.product_id).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {order.shipping_address && (
          <div className="text-left mb-6">
            <h3 className="font-bold mb-2">Shipping Address:</h3>
            <p className="text-gray-600 text-sm">{order.shipping_address}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation