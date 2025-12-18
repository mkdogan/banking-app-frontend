import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { accountsApi } from '../api/accounts'
import { transactionsApi } from '../api/transactions'
import type { AccountResponse } from '../api/types'

export default function TransferPage() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [sourceAccount, setSourceAccount] = useState('')
  const [destinationAccount, setDestinationAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsApi.getMyAccounts()
        setAccounts(data)
        if (data.length > 0) {
          setSourceAccount(data[0].accountNumber)
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])

  const selectedAccount = accounts.find(a => a.accountNumber === sourceAccount)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await transactionsApi.transfer({
        sourceAccountNumber: sourceAccount,
        destinationAccountNumber: destinationAccount,
        amount: parseFloat(amount),
        description
      })
      setSuccess('Transfer completed successfully!')
      setTimeout(() => navigate('/transactions'), 2000)
    } catch (err) {
      setError('Transfer failed. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
      <div className="relative z-10 flex flex-col w-full max-w-5xl mx-auto px-6 py-8 md:px-12 md:py-12 h-full">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">Transfer Money</h2>
            <p className="text-text-secondary text-lg">Securely move funds between accounts.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-dark/80 rounded-full border border-surface-highlight backdrop-blur-sm">
            <span className="material-symbols-outlined text-primary text-sm">lock</span>
            <span className="text-xs text-text-secondary font-medium tracking-wide uppercase">256-bit Secure</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 md:p-8 shadow-2xl">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* From Account */}
                <div className="flex flex-col gap-3">
                  <label className="text-white text-sm font-medium uppercase tracking-wide opacity-80 pl-1">From Account</label>
                  <div className="relative group">
                    <select
                      value={sourceAccount}
                      onChange={(e) => setSourceAccount(e.target.value)}
                      className="appearance-none w-full bg-surface-dark border border-surface-highlight rounded-xl h-20 pl-16 pr-12 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer hover:border-primary/50"
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.accountNumber}>
                          {account.accountType} (...{account.accountNumber.slice(-4)}) - ${account.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-primary/20 rounded-full p-2 text-primary">
                      <span className="material-symbols-outlined block">account_balance</span>
                    </div>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  {selectedAccount && (
                    <div className="flex justify-between px-2 text-xs">
                      <span className="text-text-secondary">
                        Available balance: <span className="text-white font-bold">${selectedAccount.balance.toLocaleString()}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* To Account */}
                <div className="flex flex-col gap-3">
                  <label className="text-white text-sm font-medium uppercase tracking-wide opacity-80 pl-1">To Recipient</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destinationAccount}
                      onChange={(e) => setDestinationAccount(e.target.value)}
                      className="w-full bg-surface-dark border border-surface-highlight rounded-xl h-16 pl-14 pr-4 text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter account number..."
                      required
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-4 mt-2">
                  <label className="text-white text-sm font-medium uppercase tracking-wide opacity-80 pl-1">Amount</label>
                  <div className="relative flex items-center justify-center bg-surface-dark rounded-2xl border border-surface-highlight py-8 px-4 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                    <span className="text-text-secondary text-4xl font-medium mr-2">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-none text-white text-5xl md:text-6xl font-bold w-full text-center focus:ring-0 p-0 placeholder:text-gray-600 tracking-tight"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[50, 100, 500, 1000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickAmount(val)}
                        className="py-2 rounded-lg bg-surface-dark border border-surface-highlight hover:bg-primary hover:text-background-dark hover:font-bold text-text-secondary text-sm transition-all shadow-sm"
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-3">
                  <label className="text-white text-sm font-medium uppercase tracking-wide opacity-80 pl-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-dark border border-surface-highlight rounded-xl h-14 px-4 text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Add a note..."
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-[#25cc68] text-background-dark h-14 rounded-full text-lg font-bold shadow-[0_4px_20px_rgba(43,238,121,0.3)] hover:shadow-[0_4px_25px_rgba(43,238,121,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{submitting ? 'Processing...' : 'Complete Transfer'}</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <p className="text-center text-text-secondary text-xs">Funds are typically available within minutes.</p>
                </div>
              </form>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-2xl bg-surface-dark p-6 border border-surface-highlight">
              <h3 className="text-white font-bold text-lg mb-4">Transfer Info</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span>Instant transfers available 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span>All transfers are encrypted</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <span className="material-symbols-outlined text-primary">receipt</span>
                  <span>Confirmation sent via email</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

