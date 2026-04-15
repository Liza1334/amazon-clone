import axios from 'axios'
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://amazon-clone-backend-pe3t.onrender.com/api"
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`)
}

export const cartApi = {
  get: (userId = 1) => api.get('/cart', { params: { user_id: userId } }),
  add: (data) => api.post('/cart', { ...data, user_id: data.user_id || 1 }),
  update: (data) => api.put('/cart', { ...data, user_id: data.user_id || 1 }),
  remove: (productId, userId = 1) => api.delete(`/cart/${productId}`, { params: { user_id: userId } })
}

export const ordersApi = {
  create: (data) => api.post('/orders', { ...data, user_id: data.user_id || 1 }),
  get: (userId = 1) => api.get('/orders', { params: { user_id: userId } })
}

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

export default api