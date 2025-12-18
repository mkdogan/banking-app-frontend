import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark font-display antialiased text-white flex flex-col">
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

      <main className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-[600px] mx-auto">
          <div className="bg-surface-dark rounded-xl shadow-glow border border-surface-highlight p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

            <div className="flex flex-col gap-1 mb-8">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-gray-400 text-sm">Join SpringBank and start managing your finances.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-200 ml-1">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-200 ml-1">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Username</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  minLength={6}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-background-dark border rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-red-500' 
                      : 'border-surface-highlight'
                  }`}
                  required
                  minLength={6}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="text-red-400 text-xs ml-1">Passwords do not match</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Phone Number</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-200 ml-1">Address</span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-background-dark border border-surface-highlight rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?
                <Link to="/login" className="font-bold text-white hover:text-primary transition-colors ml-1">
                  Sign in
                </Link>
              </p>
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

