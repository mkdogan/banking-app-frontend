import { useEffect, useState } from 'react'
import { cardsApi } from '../api/cards'
import type { CardResponse } from '../api/types'

export default function CardsPage() {
  const [cards, setCards] = useState<CardResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await cardsApi.getMyCards()
        setCards(data)
      } catch (error) {
        console.error('Failed to fetch cards:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCards()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  const activeCards = cards.filter(c => c.status === 'ACTIVE').length
  const blockedCards = cards.filter(c => c.status === 'BLOCKED').length

  return (
    <div className="flex-grow px-4 sm:px-6 lg:px-10 py-8 flex justify-center w-full overflow-y-auto">
      <div className="flex flex-col w-full max-w-[1200px] gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-surface-highlight">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">My Cards</h1>
            <p className="text-text-secondary text-lg">Manage your digital wallet and card security</p>
          </div>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-highlight shadow-sm">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span className="text-sm font-medium uppercase tracking-wider">Total Cards</span>
            </div>
            <p className="text-3xl font-bold text-white">{cards.length}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-highlight shadow-sm">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="text-sm font-medium uppercase tracking-wider">Active</span>
            </div>
            <p className="text-3xl font-bold text-white">{activeCards}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-highlight shadow-sm">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <span className="material-symbols-outlined text-[20px]">block</span>
              <span className="text-sm font-medium uppercase tracking-wider">Blocked</span>
            </div>
            <p className="text-3xl font-bold text-white">{blockedCards}</p>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {cards.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-gray-400">No cards found</div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className={`group relative flex flex-col sm:flex-row overflow-hidden rounded-[2rem] shadow-md border transition-transform hover:-translate-y-1 hover:shadow-xl ${
                  card.status === 'ACTIVE'
                    ? 'bg-surface-dark border-transparent'
                    : 'bg-surface-dark/50 border-surface-highlight opacity-80'
                }`}
              >
                {/* Card Info */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6 z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${
                        card.status === 'ACTIVE'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          card.status === 'ACTIVE' ? 'bg-primary animate-pulse' : 'bg-red-400'
                        }`}></span>
                        {card.status}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">
                        {card.cardType === 'CREDIT' ? 'Credit Card' : 'Debit Card'}
                      </h3>
                      <p className="text-text-secondary text-sm">{card.cardType} • Personal</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className={`font-mono text-2xl tracking-widest ${
                      card.status === 'ACTIVE' ? 'text-gray-200' : 'text-gray-500 line-through'
                    }`}>
                      **** **** **** {card.cardNumber.slice(-4)}
                    </p>
                    <div className="flex gap-4 text-sm text-text-secondary mt-1">
                      <span>Account: <span className="text-white font-medium">{card.accountNumber.slice(-4)}</span></span>
                    </div>
                  </div>
                </div>

                {/* Visual Card */}
                <div className={`relative w-full sm:w-48 flex items-center justify-center p-6 sm:p-0 overflow-hidden ${
                  card.cardType === 'CREDIT'
                    ? 'bg-gradient-to-br from-background-dark to-surface-dark'
                    : 'bg-gradient-to-tl from-slate-800 to-slate-700'
                }`}>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary blur-[60px] opacity-20 rounded-full"></div>
                  <div className="relative z-10 w-full sm:w-auto h-48 sm:h-full flex flex-col justify-center items-center sm:items-start p-4 text-white/80">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 mb-4 shadow-inner"></div>
                    <span className="font-mono text-lg opacity-50 select-none">
                      {card.cardType === 'CREDIT' ? 'TROY' : 'DEBIT'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

