import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

function Navbar() {
  const { itemCount } = useContext(CartContext)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <nav className="bg-amazon-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">amazon</span>
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 hidden md:flex">
            <div className="flex w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l text-black focus:outline-none"
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-r">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link to="/cart" className="flex items-center text-white hover:underline">
              <span className="font-bold text-lg">Cart</span>
              <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 py-0.5 text-sm font-bold">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="pb-3 md:hidden">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 rounded-l text-black focus:outline-none"
            />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-r">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </nav>
  )
}

export default Navbar