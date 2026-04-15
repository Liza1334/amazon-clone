import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi } from '../api'
import { CartContext } from '../context/CartContext'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await productsApi.getById(id)
      if (res.success) {
        setProduct(res.data)
        setImages(res.data.images || [])
        if (!res.data.images || res.data.images.length === 0) {
          setImages([{ url: res.data.image || 'https://via.placeholder.com/500x500?text=No+Image' }])
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    setAdding(true)
    const success = await addToCart(product, quantity)
    setAdding(false)
    if (success) {
      navigate('/cart')
    }
  }

  const handleBuyNow = async () => {
    setAdding(true)
    const success = await addToCart(product, quantity)
    setAdding(false)
    if (success) {
      navigate('/checkout')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
          ★
        </span>
      )
    }
    return stars
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 text-xl">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">
          Go to Home
        </button>
      </div>
    )
  }

  const specs = product.specs || {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hover:bg-gray-100">
                  ‹
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hover:bg-gray-100">
                  ›
                </button>
              </>
            )}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <img 
                src={images[currentImageIndex]?.url || product.image || 'https://via.placeholder.com/500x500?text=No+Image'} 
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 ${idx === currentImageIndex ? 'border-yellow-400' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="ml-2 text-gray-600">({product.rating || 0} ratings)</span>
            </div>
            
            <p className="text-4xl font-bold text-amazon-orange mb-4">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>
            
            {product.category_name && (
              <p className="text-sm text-gray-500 mb-4">Category: {product.category_name}</p>
            )}
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            {Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Specifications:</h3>
                <div className="bg-gray-50 rounded p-4">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(specs).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="py-2 font-medium text-gray-600 capitalize">{key}:</td>
                          <td className="py-2 text-gray-800">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <label className="mr-4 font-semibold">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={adding}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails