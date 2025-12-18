import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { accountsApi } from '../api/accounts'
import { transactionsApi } from '../api/transactions'
import { cardsApi } from '../api/cards'
import type { AccountResponse, TransactionResponse, CardResponse } from '../api/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [cards, setCards] = useState<CardResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, transactionsData, cardsData] = await Promise.all([
          accountsApi.getMyAccounts(),
          transactionsApi.getMyTransactions(),
          cardsApi.getMyCards()
        ])
        setAccounts(accountsData)
        setTransactions(transactionsData.slice(0, 5))
        setCards(cardsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.username}
          </h2>
          <p className="text-primary/80 text-base md:text-lg font-normal">Welcome back to your financial overview.</p>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-4">
        <Link to="/transfer" className="flex items-center gap-3 pr-6 pl-2 py-2 bg-surface-dark hover:bg-surface-highlight rounded-full transition-all border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-xl">send</span>
          </div>
          <span className="text-sm font-medium text-white">Send Money</span>
        </Link>
        <Link to="/accounts" className="flex items-center gap-3 pr-6 pl-2 py-2 bg-surface-dark hover:bg-surface-highlight rounded-full transition-all border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-xl">account_balance</span>
          </div>
          <span className="text-sm font-medium text-white">View Accounts</span>
        </Link>
        <Link to="/cards" className="flex items-center gap-3 pr-6 pl-2 py-2 bg-surface-dark hover:bg-surface-highlight rounded-full transition-all border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-xl">credit_card</span>
          </div>
          <span className="text-sm font-medium text-white">My Cards</span>
        </Link>
      </section>

      {/* Main Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Balance */}
        <div className="md:col-span-6 xl:col-span-5 flex flex-col justify-between glass-card p-6 md:p-8 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Balance</span>
              <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tighter mt-2">
                {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '********'}
              </h3>
            </div>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary">
                {showBalance ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          <div className="mt-8 flex items-center gap-2 relative z-10">
            <span className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-bold">
              <span className="material-symbols-outlined text-base">trending_up</span>
              {accounts.length} accounts
            </span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="md:col-span-6 xl:col-span-3 flex flex-col glass-card p-6 rounded-xl shadow-lg border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Accounts</span>
            <span className="material-symbols-outlined text-primary">account_balance</span>
          </div>
          <div className="flex flex-col gap-4 mt-auto">
            {accounts.slice(0, 2).map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    account.accountType === 'SAVINGS' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {account.accountType === 'SAVINGS' ? 'savings' : 'wallet'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold">{account.accountType}</span>
                    <span className="text-xs text-gray-500">**** {account.accountNumber.slice(-4)}</span>
                  </div>
                </div>
                <span className="text-white font-mono text-sm">${account.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Preview */}
        {cards.length > 0 && (
          <div className="md:col-span-12 xl:col-span-4 rounded-xl overflow-hidden shadow-2xl relative h-64 group transform transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-dark to-background-dark z-0"></div>
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-white/80 font-mono text-sm tracking-widest">SpringBank</span>
                <span className="material-symbols-outlined text-white text-3xl">contactless</span>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-6 bg-white/20 rounded flex items-center justify-center">
                    <div className="w-6 h-4 border border-white/50 rounded-sm"></div>
                  </div>
                  <span className="text-white text-xl font-mono tracking-widest drop-shadow-md">
                    **** **** **** {cards[0].cardNumber.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/60 uppercase font-bold">Card Type</span>
                    <span className="text-white font-bold tracking-wide uppercase">{cards[0].cardType}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-white font-black italic text-xl">{cards[0].cardType === 'CREDIT' ? 'TROY' : 'DEBIT'}</span>
                    <span className="text-[10px] text-white/60 font-bold">{cards[0].status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <Link to="/transactions" className="text-primary text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">Transaction</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-gray-400 uppercase hidden sm:table-cell">Date</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-gray-400 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">No transactions yet</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'DEPOSIT' ? 'bg-primary/10 text-primary' :
                            tx.type === 'WITHDRAW' ? 'bg-red-500/10 text-red-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            <span className="material-symbols-outlined">
                              {tx.type === 'DEPOSIT' ? 'arrow_downward' :
                               tx.type === 'WITHDRAW' ? 'arrow_upward' : 'swap_horiz'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{tx.description || tx.type}</p>
                            <p className="text-gray-500 text-xs">{tx.sourceAccountNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm hidden sm:table-cell">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${tx.type === 'DEPOSIT' ? 'text-primary' : 'text-white'}`}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

