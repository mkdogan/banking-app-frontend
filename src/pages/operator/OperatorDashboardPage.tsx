import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { accountsApi } from '../../api/accounts'
import { clientsApi } from '../../api/clients'
import { cardsApi } from '../../api/cards'
import { transactionsApi } from '../../api/transactions'
import type { AccountResponse, ClientResponse, CardResponse, TransactionResponse } from '../../api/types'

export default function OperatorDashboardPage() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [cards, setCards] = useState<CardResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, clientsData, cardsData, transactionsData] = await Promise.all([
          accountsApi.getAll(),
          clientsApi.getAll(),
          cardsApi.getAll(),
          transactionsApi.getAll()
        ])
        setAccounts(accountsData)
        setClients(clientsData)
        setCards(cardsData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length
  const activeCards = cards.filter(c => c.status === 'ACTIVE').length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-900 dark:text-white font-semibold">Dashboard</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Operator Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of all system operations and statistics.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Accounts</p>
              <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md text-xl">account_balance_wallet</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{accounts.length}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{activeAccounts} active</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Liquidity</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">monetization_on</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">${(totalBalance / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>All accounts</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Clients</p>
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-900/30 p-1 rounded-md text-xl">group</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{clients.length}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Registered users</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Cards</p>
              <span className="material-symbols-outlined text-purple-500 bg-purple-50 dark:bg-purple-900/30 p-1 rounded-md text-xl">credit_card</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cards.length}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
              <span>{activeCards} active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/operator/accounts" className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Create Account</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">New client account</p>
              </div>
            </div>
          </Link>

          <Link to="/operator/cards" className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">payment</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Issue Card</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">New card for account</p>
              </div>
            </div>
          </Link>

          <Link to="/operator/clients" className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">group</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Manage Clients</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">View all clients</p>
              </div>
            </div>
          </Link>

          <Link to="/operator/transactions" className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">sync_alt</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">View Transactions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All system transactions</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <Link to="/operator/transactions" className="text-primary text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">From/To</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">
                        {tx.sourceAccountNumber ? `...${tx.sourceAccountNumber.slice(-4)}` : 'N/A'}
                        {tx.destinationAccountNumber && ` → ...${tx.destinationAccountNumber.slice(-4)}`}
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <p className={`font-bold text-sm ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

