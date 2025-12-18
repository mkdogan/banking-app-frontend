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
import OperatorLayout from './components/OperatorLayout'
import OperatorDashboardPage from './pages/operator/OperatorDashboardPage'
import OperatorAccountsPage from './pages/operator/OperatorAccountsPage'
import OperatorClientsPage from './pages/operator/OperatorClientsPage'
import OperatorCardsPage from './pages/operator/OperatorCardsPage'
import OperatorTransactionsPage from './pages/operator/OperatorTransactionsPage'
import OperatorLoginPage from './pages/operator/OperatorLoginPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-primary text-xl">Loading...</div>
    </div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Operators should not access user routes - redirect to operator login
  if (user?.role === 'OPERATOR') {
    return <Navigate to="/operator/login" replace />
  }
  
  return <>{children}</>
}

function OperatorProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-primary text-xl">Loading...</div>
    </div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/operator/login" replace />
  }
  
  if (user?.role !== 'OPERATOR') {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/operator/login" element={<OperatorLoginPage />} />
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
        <Route path="/operator" element={
          <OperatorProtectedRoute>
            <OperatorLayout />
          </OperatorProtectedRoute>
        }>
          <Route index element={<OperatorDashboardPage />} />
          <Route path="accounts" element={<OperatorAccountsPage />} />
          <Route path="clients" element={<OperatorClientsPage />} />
          <Route path="cards" element={<OperatorCardsPage />} />
          <Route path="transactions" element={<OperatorTransactionsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

