import { useEffect, useState } from 'react'
import { cardsApi } from '../../api/cards'
import { accountsApi } from '../../api/accounts'
import type { CardResponse, CardCreateRequest, AccountResponse } from '../../api/types'

export default function OperatorCardsPage() {
  const [cards, setCards] = useState<CardResponse[]>([])
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [createForm, setCreateForm] = useState<CardCreateRequest>({
    accountNumber: '',
    cardType: 'DEBIT'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, accountsData] = await Promise.all([
          cardsApi.getAll(),
          accountsApi.getAll()
        ])
        setCards(cardsData)
        setAccounts(accountsData)
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

    if (!createForm.accountNumber) {
      setError('Please select an account')
      return
    }

    try {
      const newCard = await cardsApi.create(createForm)
      setCards([...cards, newCard])
      setShowCreateModal(false)
      setCreateForm({ accountNumber: '', cardType: 'DEBIT' })
      setSuccess('Card created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create card')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await cardsApi.delete(id)
      setCards(cards.filter(c => c.id !== id))
      setDeleteConfirm(null)
      setSuccess('Card deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete card')
      setDeleteConfirm(null)
    }
  }

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter
    return matchesSearch && matchesStatus
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
          <span className="text-slate-900 dark:text-white font-semibold">Cards</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Card Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all issued cards.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
              <span>Issue New Card</span>
            </button>
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
            {success}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Cards</p>
              <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md text-xl">credit_card</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cards.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Cards</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">check_circle</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cards.filter(c => c.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Blocked Cards</p>
              <span className="material-symbols-outlined text-red-500 bg-red-50 dark:bg-red-900/30 p-1 rounded-md text-xl">block</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cards.filter(c => c.status === 'BLOCKED').length}</p>
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
                placeholder="Search by card number or account..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Card Number</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Card Type</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No cards found</td>
                  </tr>
                ) : (
                  filteredCards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-mono text-sm text-slate-900 dark:text-white">**** **** **** {card.cardNumber.slice(-4)}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          {card.cardType}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">...{card.accountNumber.slice(-4)}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          card.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}>
                          <span className={`size-1.5 rounded-full ${card.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {card.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(card.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        {deleteConfirm === card.id ? (
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(card.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-all"
                            title="Delete Card"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        )}
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Issue New Card</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setError('')
                  setCreateForm({ accountNumber: '', cardType: 'DEBIT' })
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account</label>
                <select
                  value={createForm.accountNumber}
                  onChange={(e) => setCreateForm({ ...createForm, accountNumber: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ...{account.accountNumber.slice(-4)} ({account.clientUsername})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Card Type</label>
                <select
                  value={createForm.cardType}
                  onChange={(e) => setCreateForm({ ...createForm, cardType: e.target.value as 'DEBIT' | 'CREDIT' })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                >
                  <option value="DEBIT">Debit</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setError('')
                    setCreateForm({ accountNumber: '', cardType: 'DEBIT' })
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

