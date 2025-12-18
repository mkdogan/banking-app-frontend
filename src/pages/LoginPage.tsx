import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ username, password })
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark font-display antialiased text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-surface-highlight bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none tracking-tight">SpringBank</h2>
              <span className="text-xs text-gray-400 font-medium tracking-wide">DIGITAL BANKING</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 xl:gap-24 items-center">
          {/* Left Column */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified_user</span>
                Bank Grade Security
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Manage your wealth with <span className="text-primary">confidence</span>.
              </h1>
              <p className="text-lg text-gray-400 max-w-md">
                Access your accounts, monitor transactions, and transfer funds securely with our digital dashboard.
              </p>
            </div>
            <div className="flex gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">2.4M+</span>
                <span className="text-sm text-gray-400">Active Users</span>
              </div>
              <div className="w-px h-10 bg-surface-highlight"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">99.9%</span>
                <span className="text-sm text-gray-400">Uptime Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full max-w-[480px] mx-auto">
            <div className="bg-surface-dark rounded-xl shadow-glow border border-surface-highlight p-6 sm:p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

              <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Please enter your credentials to access your dashboard.</p>
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
                  <span>{loading ? 'Signing in...' : 'Sign In securely'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-highlight"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface-dark px-2 text-sm text-gray-500">or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?
                  <Link to="/register" className="font-bold text-white hover:text-primary transition-colors ml-1">
                    Open an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center border-t border-surface-highlight bg-background-dark">
        <p className="text-xs text-gray-600">© 2024 SpringBank. All rights reserved.</p>
      </footer>
    </div>
  )
}

