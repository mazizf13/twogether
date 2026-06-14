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
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const groupSchema = z.object({
  name: z.string().min(1, 'Nama kegiatan harus diisi').max(200, 'Maksimal 200 karakter'),
  description: z.string().max(1000, 'Deskripsi terlalu panjang').optional().nullable(),
  color: z.string().optional().nullable(),
})

type GroupFormData = z.infer<typeof groupSchema>

interface AddSharedExpenseGroupModalProps {
  isOpen: boolean
  onClose: () => void
  groupToEdit?: any
}

export function AddSharedExpenseGroupModal({ 
  isOpen, 
  onClose,
  groupToEdit
}: AddSharedExpenseGroupModalProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      color: 'neutral',
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (groupToEdit) {
        reset({
          name: groupToEdit.name,
          description: groupToEdit.description || '',
          color: groupToEdit.color || 'neutral',
        })
      } else {
        reset({
          name: '',
          description: '',
          color: 'neutral',
        })
      }
    }
  }, [isOpen, groupToEdit, reset])

  const onSubmit = (data: GroupFormData) => {
    setIsSubmitting(true)

    const request = groupToEdit 
      ? router.put(route('expenses.shared.groups.update', groupToEdit.id), data, {
          onSuccess: () => {
            setIsSubmitting(false)
            onClose()
          },
          onError: () => setIsSubmitting(false)
        })
      : router.post(route('expenses.shared.groups.store'), data, {
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
          <DialogTitle>{groupToEdit ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}</DialogTitle>
          <DialogDescription>
            Kelompokkan pengeluaran bersama dalam satu kegiatan (misal: Traveling, Beli Rumah).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kegiatan</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Misal: Liburan ke Bali"
                  className={errors.name ? "border-red-500 bg-white dark:bg-neutral-950" : "bg-white dark:bg-neutral-950"}
                />
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Tambahkan catatan untuk kegiatan ini..."
                  className="resize-none bg-white dark:bg-neutral-950"
                  rows={3}
                />
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
              {groupToEdit ? 'Simpan Perubahan' : 'Simpan Kegiatan'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
