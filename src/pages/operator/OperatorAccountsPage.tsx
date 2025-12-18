import { useEffect, useState } from 'react'
import { accountsApi } from '../../api/accounts'
import { clientsApi } from '../../api/clients'
import type { AccountResponse, AccountCreateRequest, ClientResponse } from '../../api/types'

export default function OperatorAccountsPage() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [createForm, setCreateForm] = useState<AccountCreateRequest>({
    clientId: 0,
    accountType: 'CHECKING'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, clientsData] = await Promise.all([
          accountsApi.getAll(),
          clientsApi.getAll()
        ])
        setAccounts(accountsData)
        setClients(clientsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!createForm.clientId) {
      setError('Please select a client')
      return
    }

    try {
      const newAccount = await accountsApi.create(createForm)
      setAccounts([...accounts, newAccount])
      setShowCreateModal(false)
      setCreateForm({ clientId: 0, accountType: 'CHECKING' })
      setSuccess('Account created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    }
  }

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.clientUsername.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || acc.status === statusFilter
    const matchesType = typeFilter === 'all' || acc.accountType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

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
          <span className="text-slate-900 dark:text-white font-semibold">All Accounts</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Global Account Registry</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage client accounts system-wide.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
              <span>New Account</span>
            </button>
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
            {success}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Accounts</p>
              <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md text-xl">account_balance_wallet</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{accounts.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Accounts</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">check_circle</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{accounts.filter(a => a.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Balance</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">monetization_on</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              ${(accounts.reduce((sum, a) => sum + a.balance, 0) / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Inactive Accounts</p>
              <span className="material-symbols-outlined text-red-500 bg-red-50 dark:bg-red-900/30 p-1 rounded-md text-xl">lock</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{accounts.filter(a => a.status !== 'ACTIVE').length}</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          {/* Table Controls */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 transition-shadow"
                placeholder="Filter by account number or client..."
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FROZEN">Frozen</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
              >
                <option value="all">All Types</option>
                <option value="CHECKING">Checking</option>
                <option value="SAVINGS">Savings</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Holder</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account No.</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Balance</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No accounts found</td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {account.clientUsername?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{account.clientUsername}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Account ID: {account.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono text-sm">
                          <span>•••• {account.accountNumber.slice(-4)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          <span className="material-symbols-outlined text-sm">
                            {account.accountType === 'SAVINGS' ? 'savings' : account.accountType === 'CHECKING' ? 'payments' : 'store'}
                          </span>
                          {account.accountType}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-slate-500">{account.currency}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          account.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : account.status === 'FROZEN'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            account.status === 'ACTIVE' ? 'bg-green-500' : account.status === 'FROZEN' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                          {account.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Account</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setError('')
                  setCreateForm({ clientId: 0, accountType: 'CHECKING' })
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Client</label>
                <select
                  value={createForm.clientId}
                  onChange={(e) => setCreateForm({ ...createForm, clientId: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                >
                  <option value={0}>Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} ({client.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Type</label>
                <select
                  value={createForm.accountType}
                  onChange={(e) => setCreateForm({ ...createForm, accountType: e.target.value as 'CHECKING' | 'SAVINGS' | 'BUSINESS' })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                >
                  <option value="CHECKING">Checking</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setError('')
                    setCreateForm({ clientId: 0, accountType: 'CHECKING' })
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

