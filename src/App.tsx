import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import CardsPage from './pages/CardsPage'
import TransferPage from './pages/TransferPage'
import TransactionsPage from './pages/TransactionsPage'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-primary text-xl">Loading...</div>
    </div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

