import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Navbar from './components/Navbar'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </CartProvider>
  )
}

export default App