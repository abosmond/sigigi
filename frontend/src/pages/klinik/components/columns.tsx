// src/pages/klinik/components/columns.tsx
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Klinik } from "@/services/klinik"

// Interfaces dan Types
interface CellActionProps {
  original: Klinik
  onEdit: (data: Klinik) => void
  onDelete: (data: Klinik) => void
}

type Column = {
  id: string
  header: string
  accessorKey?: keyof Klinik
  cell?: (props: { 
    row: { 
      original: Klinik; 
      index: number 
    }; 
    meta: { 
      onEdit: (data: Klinik) => void; 
      onDelete: (data: Klinik) => void;
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
    id: "nama_klinik",
    header: "Nama Klinik",
    accessorKey: "nama_klinik"
  },
  {
    id: "alamat_klinik",
    header: "Alamat",
    accessorKey: "alamat_klinik"
  },
  {
    id: "telepon",
    header: "Telepon",
    accessorKey: "telepon"
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email"
  },
  {
    id: "no_izin_klinik",
    header: "No. Izin",
    accessorKey: "no_izin_klinik"
  },
  {
    id: "jam_operasional",
    header: "Jam Operasional",
    accessorKey: "jam_operasional"
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