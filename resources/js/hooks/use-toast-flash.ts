import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'

export function useToastFlash() {
  const { flash } = usePage().props as any

  useEffect(() => {
    if (!flash) return

    if (flash.success) {
      toast.success(flash.success)
    } else if (flash.error) {
      toast.error(flash.error)
    } else if (flash.status) {
      // General status messages (like default Laravel auth messages)
      toast.success(flash.status)
    }
  }, [flash])
}
