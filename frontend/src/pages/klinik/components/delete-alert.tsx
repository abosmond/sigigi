// src/pages/klinik/components/delete-alert.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  
  interface DeleteAlertProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading: boolean
    itemToDelete: {
      nama_klinik: string
    } | null
  }
  
  export function DeleteAlert({
    open,
    onOpenChange,
    onConfirm,
    loading,
    itemToDelete
  }: DeleteAlertProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Klinik "{itemToDelete?.nama_klinik}" akan dihapus secara permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }