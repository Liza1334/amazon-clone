import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const image = product.image || 'https://via.placeholder.com/300x300?text=No+Image'
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 block"
    >
      <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
          }}
        />
      </div>
      
      <h3 className="font-semibold text-lg mb-2 truncate line-clamp-2">{product.name}</h3>
      
      <div className="flex items-center mb-2">
        <div className="flex">{renderStars(product.rating)}</div>
        <span className="ml-2 text-sm text-gray-500">({product.rating || 0})</span>
      </div>
      
      <p className="text-2xl font-bold text-amazon-orange">
        ₹{product.price?.toLocaleString('en-IN')}
      </p>
      
      {product.category_name && (
        <p className="text-sm text-gray-500 mt-1">{product.category_name}</p>
      )}
    </Link>
  )
}

export default ProductCard