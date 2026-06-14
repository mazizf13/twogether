import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { AmountInput } from '@/components/molecules/AmountInput'
import { Loader2 } from 'lucide-react'

const targetSchema = z.object({
  target_amount_cents: z.number().min(1, 'Target harus lebih dari 0'),
})

type TargetFormData = z.infer<typeof targetSchema>

interface SetTargetModalProps {
  isOpen: boolean
  onClose: () => void
  currencyCode: string
  currentTargetCents?: number | null
}

export function SetTargetModal({ 
  isOpen, 
  onClose, 
  currencyCode,
  currentTargetCents 
}: SetTargetModalProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      target_amount_cents: currentTargetCents || 0,
    }
  })

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      reset({
        target_amount_cents: currentTargetCents || 0,
      })
    }
  }, [isOpen, currentTargetCents, reset])

  const onSubmit = (data: TargetFormData) => {
    setIsSubmitting(true)

    router.post(route('savings.fund.target'), data, {
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => setIsSubmitting(false)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>Set Target Tabungan</DialogTitle>
          <DialogDescription>
            Tentukan jumlah target tabungan pernikahan kalian agar lebih mudah dilacak.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Tabungan</Label>
            <Controller
              control={control}
              name="target_amount_cents"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  currencyCode={currencyCode}
                  placeholder="0"
                />
              )}
            />
            {errors.target_amount_cents && (
               <p className="text-xs text-red-500">{errors.target_amount_cents.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
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
              Simpan Target
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
