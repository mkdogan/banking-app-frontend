import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OperatorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/operator', icon: 'dashboard', label: 'Dashboard' },
    { path: '/operator/clients', icon: 'group', label: 'Clients' },
    { path: '/operator/accounts', icon: 'credit_card', label: 'Accounts' },
    { path: '/operator/cards', icon: 'payment', label: 'Cards' },
    { path: '/operator/transactions', icon: 'sync_alt', label: 'Transactions' },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <div className="flex flex-col h-full justify-between p-4">
          <div className="flex flex-col gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="bg-primary aspect-square rounded-xl size-10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">BankOps</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-normal mt-1">Admin Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/operator'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer / User */}
          <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username || 'Operator'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">Operator Panel</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

