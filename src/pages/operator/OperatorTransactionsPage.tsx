import { useEffect, useState } from 'react'
import { transactionsApi } from '../../api/transactions'
import type { TransactionResponse } from '../../api/types'

export default function OperatorTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionsApi.getAll()
        setTransactions(data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.sourceAccountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.destinationAccountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toString().includes(searchTerm)
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const depositCount = transactions.filter(tx => tx.type === 'DEPOSIT').length
  const withdrawCount = transactions.filter(tx => tx.type === 'WITHDRAW').length
  const transferCount = transactions.filter(tx => tx.type === 'TRANSFER').length

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
          <span className="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 hover:text-primary transition-colors font-medium">Operator</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Transactions</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View all system-wide transactions.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Transactions</p>
              <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md text-xl">sync_alt</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{transactions.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Volume</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">monetization_on</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">${(totalVolume / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Deposits</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">arrow_downward</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{depositCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Withdrawals</p>
              <span className="material-symbols-outlined text-red-500 bg-red-50 dark:bg-red-900/30 p-1 rounded-md text-xl">arrow_upward</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{withdrawCount}</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          {/* Controls */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 transition-shadow"
                placeholder="Search by account, description, or ID..."
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAW">Withdraw</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">From/To</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No transactions found</td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="text-sm font-mono text-slate-600 dark:text-slate-400">#{tx.id}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          tx.type === 'DEPOSIT'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : tx.type === 'WITHDRAW'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {tx.type === 'DEPOSIT' ? 'arrow_downward' : tx.type === 'WITHDRAW' ? 'arrow_upward' : 'swap_horiz'}
                          </span>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {tx.sourceAccountNumber && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                              From: ...{tx.sourceAccountNumber.slice(-4)}
                            </p>
                          )}
                          {tx.destinationAccountNumber && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                              To: ...{tx.destinationAccountNumber.slice(-4)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className={`font-bold text-sm ${
                          tx.type === 'DEPOSIT' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{tx.description || '-'}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(tx.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

