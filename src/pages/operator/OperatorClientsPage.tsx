import { useEffect, useState } from 'react'
import { clientsApi } from '../../api/clients'
import type { ClientResponse } from '../../api/types'

export default function OperatorClientsPage() {
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientsApi.getAll()
        setClients(data)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await clientsApi.delete(id)
      setClients(clients.filter(c => c.id !== id))
      setDeleteConfirm(null)
      setSuccess('Client deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete client')
      setDeleteConfirm(null)
    }
  }

  const filteredClients = clients.filter(client =>
    client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <span className="text-slate-900 dark:text-white font-semibold">Clients</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Client Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all registered clients.</p>
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
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Clients</p>
              <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md text-xl">group</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{clients.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Clients</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 dark:bg-green-900/30 p-1 rounded-md text-xl">check_circle</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{clients.filter(c => c.enabled).length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Roles</p>
              <span className="material-symbols-outlined text-purple-500 bg-purple-50 dark:bg-purple-900/30 p-1 rounded-md text-xl">badge</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Set(clients.map(c => c.role)).size}
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          {/* Search */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 transition-shadow"
                placeholder="Search by name, username, or email..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No clients found</td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {client.firstName?.charAt(0) || client.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {client.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{client.username}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{client.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          {client.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          client.enabled
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}>
                          <span className={`size-1.5 rounded-full ${client.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {client.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {deleteConfirm === client.id ? (
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(client.id)}
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
                            onClick={() => setDeleteConfirm(client.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-all"
                            title="Delete Client"
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
    </div>
  )
}

