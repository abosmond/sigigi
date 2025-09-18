import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HargaObat } from "@/services/hargaObat"

interface CellActionProps {
  original: HargaObat
  onEdit: (data: HargaObat) => void
  onDelete: (data: HargaObat) => void
}

type Column = {
  id: string
  header: string
  accessorKey?: keyof HargaObat
  cell?: (props: { 
    row: { 
      original: HargaObat; 
      index: number 
    }; 
    meta: { 
      onEdit: (data: HargaObat) => void; 
      onDelete: (data: HargaObat) => void;
      currentPage: number;
      itemsPerPage: number;
    } 
  }) => React.ReactNode
}

const CellAction = ({ original, onEdit, onDelete }: CellActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(original)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(original)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: Column[] = [
  {
    id: "number",
    header: "No",
    cell: ({ row, meta }) => {
      const { currentPage, itemsPerPage } = meta;
      return (currentPage - 1) * itemsPerPage + row.index + 1;
    }
  },
  {
    id: "nama_obat",
    header: "Nama Obat",
    cell: ({ row }) => row.original.obat?.nama_obat || '-'
  },
  {
    id: "nama_klinik",
    header: "Nama Klinik",
    cell: ({ row }) => row.original.klinik?.nama_klinik || '-'
  },
  {
    id: "harga",
    header: "Harga",
    cell: ({ row }) => {
      // Format harga as currency
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(row.original.harga)
    }
  },
  {
    id: "satuan",
    header: "Satuan",
    cell: ({ row }) => row.original.obat?.satuan || '-'
  },
  {
    id: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => row.original.keterangan || '-'
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, meta }) => (
      <CellAction 
        original={row.original}
        onEdit={meta.onEdit}
        onDelete={meta.onDelete}
      />
    ),
  },
]