import { useEffect, useState } from 'react'
import { accountsApi } from '../api/accounts'
import type { AccountResponse } from '../api/types'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsApi.getMyAccounts()
        setAccounts(data)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])

  const filteredAccounts = filter === 'all' 
    ? accounts 
    : accounts.filter(a => a.accountType === filter)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 z-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white">Accounts</h2>
          <p className="text-text-secondary text-base font-normal">Manage your banking portfolios and balances</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['all', 'CHECKING', 'SAVINGS', 'BUSINESS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`whitespace-nowrap h-10 px-5 rounded-full font-medium text-sm transition-colors ${
                filter === type
                  ? 'bg-white text-background-dark'
                  : 'bg-surface-highlight text-white hover:bg-surface-highlight/80'
              }`}
            >
              {type === 'all' ? 'All Accounts' : type}
            </button>
          ))}
        </div>

        {/* Accounts List */}
        <div className="flex flex-col gap-4">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-sm font-medium text-text-secondary uppercase tracking-wider">
            <div className="col-span-4">Account Details</div>
            <div className="col-span-3">Account Number</div>
            <div className="col-span-3 text-right">Balance</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No accounts found</div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id}
                className={`group flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-5 rounded-2xl shadow-sm border transition-all ${
                  account.status === 'ACTIVE'
                    ? 'bg-surface-dark border-surface-highlight hover:shadow-md'
                    : 'bg-surface-dark/50 border-surface-highlight/50 opacity-80'
                }`}
              >
                {/* Details */}
                <div className="col-span-4 flex items-center gap-4 w-full">
                  <div className={`flex items-center justify-center size-12 rounded-full ${
                    account.accountType === 'CHECKING' ? 'bg-blue-500/20 text-blue-300' :
                    account.accountType === 'SAVINGS' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    <span className="material-symbols-outlined">
                      {account.accountType === 'CHECKING' ? 'account_balance' :
                       account.accountType === 'SAVINGS' ? 'savings' : 'store'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-white">{account.accountType}</span>
                    <span className="text-sm text-gray-400">Personal Account</span>
                  </div>
                </div>

                {/* Account Number */}
                <div className="col-span-3 w-full flex items-center justify-between md:justify-start gap-3">
                  <span className="md:hidden text-sm text-gray-500">Account No:</span>
                  <div className="font-mono text-gray-300 bg-background-dark px-3 py-1 rounded-lg">
                    •••• {account.accountNumber.slice(-4)}
                  </div>
                </div>

                {/* Balance */}
                <div className="col-span-3 w-full flex md:block items-center justify-between md:text-right">
                  <span className="md:hidden text-sm text-gray-500">Balance:</span>
                  <span className="font-display font-bold text-xl text-white">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 w-full flex justify-between md:justify-center items-center gap-4">
                  <span className="md:hidden text-sm text-gray-500">Status:</span>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    account.status === 'ACTIVE'
                      ? 'bg-background-dark border-surface-highlight'
                      : 'bg-gray-800 border-gray-700'
                  }`}>
                    <div className={`size-2 rounded-full ${
                      account.status === 'ACTIVE' ? 'bg-primary animate-pulse' : 'bg-gray-500'
                    }`}></div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                      account.status === 'ACTIVE' ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

