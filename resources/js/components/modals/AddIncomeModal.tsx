import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { router } from '@inertiajs/react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

import { PersonalIncome, IncomeSource } from '@/types'
import { AmountInput } from '@/components/molecules/AmountInput'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarIcon, Loader2, Info, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const incomeSchema = z.object({
  amount_cents: z.number().min(1, 'Jumlah harus lebih dari 0'),
  currency_code: z.string().length(3),
  source: z.string().min(1, 'Pilih sumber pemasukan'),
  description: z.string().max(500, 'Deskripsi terlalu panjang').optional().nullable(),
  income_date: z.date(),
  is_recurring: z.boolean(),
  recurring_frequency: z.string().optional().nullable(),
  is_visible_to_partner: z.boolean(),
}).refine(data => {
  if (data.is_recurring && !data.recurring_frequency) {
    return false;
  }
  return true;
}, {
  message: "Frekuensi rutin harus dipilih",
  path: ["recurring_frequency"]
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface AddIncomeModalProps {
  isOpen: boolean
  onClose: () => void
  sources: Record<string, string>
  currencyCode: string
  incomeToEdit?: PersonalIncome | null
}

const FREQUENCIES = [
  { value: 'weekly', label: 'Setiap Minggu' },
  { value: 'biweekly', label: 'Dua Minggu Sekali' },
  { value: 'monthly', label: 'Setiap Bulan' },
  { value: 'quarterly', label: 'Setiap Kuartal' },
  { value: 'yearly', label: 'Setiap Tahun' },
]

export function AddIncomeModal({ 
  isOpen, 
  onClose, 
  sources,
  currencyCode,
  incomeToEdit 
}: AddIncomeModalProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount_cents: 0,
      currency_code: currencyCode,
      source: '',
      description: '',
      income_date: new Date(),
      is_recurring: false,
      recurring_frequency: null,
      is_visible_to_partner: false,
    }
  })

  const isRecurring = watch('is_recurring')
  const amountCents = watch('amount_cents')
  const recurringFrequency = watch('recurring_frequency')

  useEffect(() => {
    if (isOpen) {
      if (incomeToEdit) {
        reset({
          amount_cents: incomeToEdit.amount_cents,
          currency_code: incomeToEdit.currency_code,
          source: incomeToEdit.source,
          description: incomeToEdit.description || '',
          income_date: new Date(incomeToEdit.income_date),
          is_recurring: incomeToEdit.is_recurring,
          recurring_frequency: incomeToEdit.recurring_frequency,
          is_visible_to_partner: incomeToEdit.is_visible_to_partner,
        })
      } else {
        reset({
          amount_cents: 0,
          currency_code: currencyCode,
          source: '',
          description: '',
          income_date: new Date(),
          is_recurring: false,
          recurring_frequency: null,
          is_visible_to_partner: false,
        })
      }
    }
  }, [isOpen, incomeToEdit, reset, currencyCode])

  const onSubmit = (data: IncomeFormData) => {
    setIsSubmitting(true)

    const payload = {
      ...data,
      income_date: format(data.income_date, 'yyyy-MM-dd')
    }

    if (incomeToEdit) {
      router.put(route('income.personal.update', incomeToEdit.id), payload, {
        onSuccess: () => {
          setIsSubmitting(false)
          onClose()
        },
        onError: () => setIsSubmitting(false)
      })
    } else {
      router.post(route('income.personal.store'), payload, {
        onSuccess: () => {
          setIsSubmitting(false)
          onClose()
        },
        onError: () => setIsSubmitting(false)
      })
    }
  }

  // Calculate monthly equivalent display
  const getMonthlyEquivalent = () => {
    if (!isRecurring || !recurringFrequency || !amountCents) return null;
    let monthly = 0;
    switch (recurringFrequency) {
      case 'weekly': monthly = amountCents * 4.33; break;
      case 'biweekly': monthly = amountCents * 2.17; break;
      case 'monthly': return null; // already monthly
      case 'quarterly': monthly = amountCents / 3; break;
      case 'yearly': monthly = amountCents / 12; break;
      default: return null;
    }
    
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(Math.round(monthly / 100))
    
    return `≈ ${formatted} / bulan`
  }

  const monthlyEquivalent = getMonthlyEquivalent()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{incomeToEdit ? 'Edit Pemasukan' : 'Tambah Pemasukan'}</DialogTitle>
          <DialogDescription>
            Catat pemasukan pribadimu di sini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Pemasukan</Label>
            <Controller
              control={control}
              name="amount_cents"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  currencyCode={currencyCode}
                  placeholder="0"
                />
              )}
            />
            {errors.amount_cents && (
              <p className="text-xs text-red-500">{errors.amount_cents.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Sumber</Label>
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger id="source" className={errors.source ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sources).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label as React.ReactNode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.source && (
                <p className="text-xs text-red-500">{errors.source.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Controller
                control={control}
                name="income_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white dark:bg-neutral-950",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3 bg-white dark:bg-neutral-950 rounded-xl shadow-md border-neutral-100 dark:border-neutral-800 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Catatan (Opsional)</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Gaji bulan Juni, Project ABC..."
                  className="resize-none bg-white dark:bg-neutral-950"
                  rows={2}
                />
              )}
            />
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl space-y-4 border border-neutral-100 dark:border-neutral-800">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setValue('is_recurring', !watch('is_recurring'))}
            >
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer pointer-events-none">Pemasukan Rutin?</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 pointer-events-none">Tandai jika pemasukan ini berulang</p>
              </div>
              <Controller
                control={control}
                name="is_recurring"
                render={({ field }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(!field.value);
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                    field.value ? "bg-pink-500" : "bg-neutral-200"
                  )}
                  role="switch"
                  aria-checked={field.value}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out",
                      field.value ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
                )}
              />
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <Label className="mb-2 block text-sm">Frekuensi</Label>
                <Controller
                  control={control}
                  name="recurring_frequency"
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.recurring_frequency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Pilih frekuensi..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recurring_frequency && (
                  <p className="text-xs text-red-500 mt-1">{errors.recurring_frequency.message}</p>
                )}
                {monthlyEquivalent && (
                  <p className="text-xs text-blue-600 mt-2 flex items-center font-medium">
                    <Info className="w-3 h-3 mr-1" /> {monthlyEquivalent}
                  </p>
                )}
              </div>
            )}
          </div>

          <div 
            className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl border border-pink-100 cursor-pointer hover:bg-pink-100/50 transition-colors"
            onClick={() => setValue('is_visible_to_partner', !watch('is_visible_to_partner'))}
          >
            <div className="space-y-0.5">
              <Label className="text-base text-pink-900 cursor-pointer pointer-events-none">Tampilkan ke pasangan?</Label>
              <p className="text-xs text-pink-600/80 pointer-events-none">Pasanganmu bisa melihat pemasukan ini</p>
            </div>
            <Controller
              control={control}
              name="is_visible_to_partner"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(!field.value);
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                    field.value ? "bg-pink-500" : "bg-neutral-200"
                  )}
                  role="switch"
                  aria-checked={field.value}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out",
                      field.value ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:bg-neutral-900"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {incomeToEdit ? 'Simpan Perubahan' : 'Tambah Pemasukan'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
