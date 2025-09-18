// src/pages/master/Obat/components/columns.tsx
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Obat } from "@/services/obat"

// Interfaces dan Types
interface CellActionProps {
  original: Obat
  onEdit: (data: Obat) => void
  onDelete: (data: Obat) => void
}

type Column = {
  id: string
  header: string
  accessorKey?: keyof Obat
  cell?: (props: { 
    row: { 
      original: Obat; 
      index: number 
    }; 
    meta: { 
      onEdit: (data: Obat) => void; 
      onDelete: (data: Obat) => void;
      currentPage: number;
      itemsPerPage: number;
    } 
  }) => React.ReactNode
}

// Component CellAction
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

// Columns definition
// Columns definition
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
    id: "name",
    header: "Nama Obat",
    accessorKey: "nama_obat"
  },
  {
    id: "satuan",
    header: "Satuan",
    accessorKey: "satuan"
  },
  {
    id: "dosis",
    header: "Dosis",
    accessorKey: "dosis"
  },
  {
    id: "keterangan",
    header: "Keterangan",
    accessorKey: "keterangan"
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