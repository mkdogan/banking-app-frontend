import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/accounts', icon: 'account_balance_wallet', label: 'Accounts' },
    { path: '/transfer', icon: 'swap_horiz', label: 'Transfers' },
    { path: '/transactions', icon: 'receipt_long', label: 'Transactions' },
    { path: '/cards', icon: 'credit_card', label: 'Cards' },
  ]

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-surface-highlight bg-surface-dark p-6">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-background-dark font-bold text-xl">token</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none tracking-tight text-white">SpringBank</h1>
              <p className="text-xs text-primary/70 font-medium tracking-wide">SECURE BANKING</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-full transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-surface-highlight to-transparent border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">shield_lock</span>
              <p className="text-xs font-semibold text-white">Session Secure</p>
            </div>
            <p className="text-[10px] text-gray-400">Your session is encrypted using TLS 1.3.</p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user?.username}</p>
              <p className="text-text-secondary text-xs truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-6 bg-surface-highlight hover:bg-red-500/10 hover:text-red-400 text-white transition-all duration-300"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-surface-dark border-b border-surface-highlight sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">token</span>
            <span className="font-bold text-white">SpringBank</span>
          </div>
          <button onClick={handleLogout} className="text-white">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  )
}

