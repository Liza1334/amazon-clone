import { useState } from 'react'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext)
  const [updating, setUpdating] = useState(false)

  const image = item.image || 'https://via.placeholder.com/100x100?text=No+Image'

  const handleQuantityChange = async (newQty) => {
    setUpdating(true)
    await updateQuantity(item.product_id, newQty)
    setUpdating(false)
  }

  const handleRemove = async () => {
    setUpdating(true)
    await removeFromCart(item.product_id)
    setUpdating(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row gap-4">
      <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
        <img 
          src={image} 
          alt={item.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
        <p className="text-xl font-bold text-amazon-orange mt-1">
          ₹{item.price?.toLocaleString('en-IN')}
        </p>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              −
            </button>
            <span className="px-3 py-1 min-w-[40px] text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            disabled={updating}
            className="text-red-600 hover:underline text-sm disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-lg">
          ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}

export default CartItem