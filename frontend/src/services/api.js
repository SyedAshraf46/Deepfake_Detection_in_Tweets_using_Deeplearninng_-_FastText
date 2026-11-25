import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests dynamically using interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // Debug: Log token being sent (remove in production)
      console.log('🔑 Sending token with request:', config.url, 'Token exists:', !!token)
    } else {
      console.warn('⚠️ No token found for request:', config.url)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401/422 errors (unauthorized/expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422) {
      const currentPath = window.location.pathname
      const token = localStorage.getItem('token')
      
      // Don't redirect if we're on public pages
      if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
        return Promise.reject(error)
      }
      
      // Only redirect if there's no token at all
      // If token exists but got 422, it might be:
      // 1. Expired (let component handle gracefully)
      // 2. Invalid format (backend issue)
      // 3. Just registered/logged in (timing issue)
      if (!token) {
        // No token - clear everything and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        // Use setTimeout to avoid redirect during render
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }, 500)
      }
      // If token exists, let the component handle the error
      // Don't auto-redirect to avoid redirect loops
    }
    return Promise.reject(error)
  }
)

export default api

