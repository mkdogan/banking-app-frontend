import { useEffect, useState } from 'react'
import { transactionsApi } from '../api/transactions'
import type { TransactionResponse } from '../api/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionsApi.getMyTransactions()
        setTransactions(data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter)

  const totalIncome = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSpending = transactions
    .filter(t => t.type !== 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Transaction History</h2>
          <p className="text-text-secondary text-base font-normal">Review your recent financial activity.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-surface-dark border border-surface-highlight relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-white">account_balance</span>
          </div>
          <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Total Transactions</p>
          <p className="text-white text-3xl font-bold tracking-tight">{transactions.length}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-surface-dark border border-surface-highlight relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">arrow_downward</span>
          </div>
          <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Total Income</p>
          <p className="text-white text-3xl font-bold tracking-tight">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-surface-dark border border-surface-highlight relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-rose-400">arrow_upward</span>
          </div>
          <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Total Spending</p>
          <p className="text-white text-3xl font-bold tracking-tight">${totalSpending.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-dark p-2 rounded-2xl border border-surface-highlight flex flex-col lg:flex-row gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {['all', 'DEPOSIT', 'WITHDRAW', 'TRANSFER'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-2 h-12 px-4 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                filter === type
                  ? 'bg-primary text-background-dark'
                  : 'bg-surface-highlight hover:bg-[#2a563c] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {type === 'all' ? 'filter_list' :
                 type === 'DEPOSIT' ? 'arrow_downward' :
                 type === 'WITHDRAW' ? 'arrow_upward' : 'swap_horiz'}
              </span>
              <span>{type === 'all' ? 'All' : type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="flex flex-col bg-surface-dark rounded-2xl border border-surface-highlight overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-highlight/50 text-text-secondary text-xs uppercase tracking-wider">
                <th className="p-6 font-medium">Transaction</th>
                <th className="p-6 font-medium">Date & Time</th>
                <th className="p-6 font-medium">Type</th>
                <th className="p-6 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">No transactions found</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-surface-highlight/30 transition-colors border-b border-surface-highlight/30">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === 'DEPOSIT' ? 'bg-primary/20 text-primary' :
                          tx.type === 'WITHDRAW' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <span className="material-symbols-outlined">
                            {tx.type === 'DEPOSIT' ? 'arrow_downward' :
                             tx.type === 'WITHDRAW' ? 'arrow_upward' : 'swap_horiz'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{tx.description || tx.type}</span>
                          <span className="text-text-secondary text-xs">
                            {tx.sourceAccountNumber && `From: ...${tx.sourceAccountNumber.slice(-4)}`}
                            {tx.destinationAccountNumber && ` → To: ...${tx.destinationAccountNumber.slice(-4)}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-white">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        <span className="text-text-secondary text-xs">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'DEPOSIT' ? 'bg-primary/20 text-primary' :
                        tx.type === 'WITHDRAW' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {tx.type === 'DEPOSIT' ? 'payments' :
                           tx.type === 'WITHDRAW' ? 'money_off' : 'swap_horiz'}
                        </span>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className={`font-bold block ${tx.type === 'DEPOSIT' ? 'text-primary' : 'text-white'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-surface-highlight bg-surface-dark flex items-center justify-between">
          <p className="text-text-secondary text-sm">
            Showing <span className="text-white font-bold">{filteredTransactions.length}</span> transactions
          </p>
        </div>
      </div>
    </div>
  )
}

