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
      obat?: {
        nama_obat: string
      }
      klinik?: {
        nama_klinik: string
      }
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
              Data harga obat {itemToDelete?.obat?.nama_obat} di {itemToDelete?.klinik?.nama_klinik} akan dihapus secara permanen dan tidak dapat dikembalikan.
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