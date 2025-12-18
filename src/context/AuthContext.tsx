import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../api/authService'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../api/types'

interface AuthContextType {
  user: AuthResponse | null
  isAuthenticated: boolean
  loading: boolean
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = authService.getUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authService.login(data)
    setUser(response)
    return response
  }

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await authService.register(data)
    setUser(response)
    return response
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

