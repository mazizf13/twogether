import React, { useState } from 'react'
import { Head, usePage, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { CheckCircle2, ArrowRightLeft, History } from 'lucide-react'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { SettleUpModal } from '@/components/modals/SettleUpModal'
import { cn } from '@/lib/utils'

export default function Balance({
  balance,
  settlements,
  couple,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false)

  const viewerOwes = balance.net_cents < 0
  const payerName = viewerOwes ? 'You' : balance.owed_by_name
  const payeeName = viewerOwes ? balance.owed_to_name : 'You'

  return (
    <AppShell title="Saldo" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Header Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 space-x-6 overflow-x-auto">
        <Link href={route('expenses.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Pengeluaran Pribadi
        </Link>
        <Link href={route('income.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Pemasukan Pribadi
        </Link>
        <Link href={route('expenses.shared')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Shared
        </Link>
        <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
          Balance
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Saldo Bersama</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Lihat siapa yang berutang berdasarkan pengeluaran bersama.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Balance Card */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[320px] text-center relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm mx-auto">
              {balance.is_settled ? (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-white shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Semua sudah lunas!</h2>
                  <p className="text-neutral-500 dark:text-neutral-400">Saat ini tidak ada tagihan tertunggak antara kamu dan pasanganmu.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 font-medium text-sm mb-6 border border-neutral-100 dark:border-neutral-800">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Saldo Saat Ini</span>
                  </div>
                  
                  <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                    {payerName} {viewerOwes ? 'owe' : 'owes'} {payeeName}
                  </p>
                  
                  <CurrencyAmount 
                    cents={Math.abs(balance.net_cents)} 
                    currencyCode={couple.currency_code} 
                    size="display" 
                    className={cn(
                      "text-5xl md:text-6xl mb-8",
                      viewerOwes ? "text-orange-500" : "text-pink-600"
                    )} 
                  />

                  <button
                    onClick={() => setIsSettleModalOpen(true)}
                    className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors shadow-md"
                  >
                    Settle Up Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Math */}
          <div className="mt-8 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wider">Rincian Hitungan</h3>
            
            <div className="grid grid-cols-2 gap-8 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-100 dark:bg-neutral-800 -translate-x-1/2" />
              
              {/* Partner A */}
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">{couple.partner_a.display_name}</span>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Total Dibayar</span>
                    <CurrencyAmount cents={balance.partner_a_paid} currencyCode={couple.currency_code} className="font-medium" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Total Tanggungan</span>
                    <CurrencyAmount cents={balance.partner_a_share} currencyCode={couple.currency_code} className="font-medium" />
                  </div>
                  <div className="pt-2 border-t border-neutral-50 flex justify-between text-sm font-semibold">
                    <span className="text-neutral-700 dark:text-neutral-200">Sisa</span>
                    <CurrencyAmount 
                      cents={balance.partner_a_paid - balance.partner_a_share} 
                      currencyCode={couple.currency_code} 
                      showSign
                      className={balance.partner_a_paid - balance.partner_a_share < 0 ? "text-rose-500" : "text-green-600"} 
                    />
                  </div>
                </div>
              </div>

              {/* Partner B */}
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">{couple.partner_b.display_name}</span>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Total Dibayar</span>
                    <CurrencyAmount cents={balance.partner_b_paid} currencyCode={couple.currency_code} className="font-medium" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Total Tanggungan</span>
                    <CurrencyAmount cents={balance.partner_b_share} currencyCode={couple.currency_code} className="font-medium" />
                  </div>
                  <div className="pt-2 border-t border-neutral-50 flex justify-between text-sm font-semibold">
                    <span className="text-neutral-700 dark:text-neutral-200">Sisa</span>
                    <CurrencyAmount 
                      cents={balance.partner_b_paid - balance.partner_b_share} 
                      currencyCode={couple.currency_code} 
                      showSign
                      className={balance.partner_b_paid - balance.partner_b_share < 0 ? "text-rose-500" : "text-green-600"} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-neutral-400 mt-6 text-center">
              Ini menghitung selisih antara jumlah yang telah dibayar setiap orang dengan tanggungan mereka untuk pengeluaran yang belum dilunasi.
            </p>
          </div>
        </div>

        {/* Pelunasan Terkini Sidebar */}
        <div>
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 h-full">
            <div className="flex items-center space-x-2 mb-6 text-neutral-900 dark:text-neutral-100">
              <History className="w-5 h-5 text-neutral-400" />
              <h3 className="font-semibold">Pelunasan Terkini</h3>
            </div>

            {settlements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada riwayat pelunasan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {settlements.map((settlement: any) => (
                  <div key={settlement.id} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-400" />
                    <div className="absolute left-[3px] top-3 bottom-[-20px] w-px bg-neutral-100 dark:bg-neutral-800 last:hidden" />
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {settlement.payer.display_name} paid {settlement.payee.display_name}
                        </span>
                        <CurrencyAmount cents={settlement.amount_cents} currencyCode={couple.currency_code} className="text-sm font-semibold text-green-600" />
                      </div>
                      <span className="text-xs text-neutral-400">{settlement.settlement_date_formatted}</span>
                      {settlement.notes && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg mt-1 inline-block">
                          "{settlement.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <SettleUpModal 
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        balance={balance}
        currencyCode={couple.currency_code}
      />

    </AppShell>
  )
}



