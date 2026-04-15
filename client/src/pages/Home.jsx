import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productsApi } from '../api'

function Home() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = useState('')
  const [sort, setSort] = useState('created_at')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearch(searchParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [search, categoryId, sort])

  const fetchCategories = async () => {
    try {
      const res = await productsApi.getAll({ limit: 100 })
      if (res.success) {
        const uniqueCategories = [...new Map(res.data.map(item => [item.category_id, { id: item.category_id, name: item.category_name }])).values()].filter(c => c.id)
        setCategories(uniqueCategories)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = { limit: 50 }
      if (search) params.search = search
      if (categoryId) params.category_id = categoryId
      if (sort) params.sort = sort
      
      const res = await productsApi.getAll(params)
      if (res.success) {
        setProducts(res.data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-gray-100 to-transparent py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Welcome to Amazon Clone</h1>
          <p className="text-gray-600">Shop the best products at amazing prices</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded shadow p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 min-w-[200px] border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
            />
            
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-4 py-2 focus:outline-none focus:border-yellow-400"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home