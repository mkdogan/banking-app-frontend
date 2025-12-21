import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function OperatorLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ username, password })
      if (response?.role !== 'OPERATOR') {
        // not an operator, clear any auth state and show error
        logout()
        setError('Invalid username or password')
        return
      }

      navigate('/operator')
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark font-display antialiased text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 xl:gap-24 items-center">
          {/* Left Column */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified_user</span>
                Operator Access
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Operator Portal
              </h1>
              <p className="text-lg text-gray-400 max-w-md">
                Secure access for bank operators to manage clients and system resources.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full max-w-[480px] mx-auto">
            <div className="bg-surface-dark rounded-xl shadow-glow border border-surface-highlight p-6 sm:p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

              <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-2xl font-bold">Operator Sign In</h2>
                <p className="text-gray-400 text-sm">Enter your operator credentials to access the admin panel.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-200 ml-1">Username</span>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-background-dark border border-surface-highlight rounded-lg py-4 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-200 ml-1">Password</span>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>key</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background-dark border border-surface-highlight rounded-lg py-4 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
