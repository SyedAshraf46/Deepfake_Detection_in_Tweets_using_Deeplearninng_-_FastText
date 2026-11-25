import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, LogOut, User, Home as HomeIcon } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-primary-light border-b border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-secondary" />
            <span className="text-xl font-bold text-gray-100">Deepfake Detector</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-secondary transition-colors flex items-center space-x-1"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                {user.is_admin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-300 hover:text-secondary transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-secondary transition-colors flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-alert transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

