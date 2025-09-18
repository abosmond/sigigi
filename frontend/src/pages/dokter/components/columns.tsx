// src/pages/dokter/components/columns.tsx
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dokter } from "@/services/dokter"

// Interfaces dan Types
interface CellActionProps {
  original: Dokter
  onEdit: (data: Dokter) => void
  onDelete: (data: Dokter) => void
}

type Column = {
  id: string
  header: string
  accessorKey?: keyof Dokter
  cell?: (props: { 
    row: { 
      original: Dokter; 
      index: number 
    }; 
    meta: { 
      onEdit: (data: Dokter) => void; 
      onDelete: (data: Dokter) => void;
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
    id: "nama_dokter",
    header: "Nama Dokter",
    accessorKey: "nama_dokter"
  },
  {
    id: "no_str",
    header: "No STR",
    accessorKey: "no_str"
  },
  {
    id: "spesialis",
    header: "Spesialis",
    accessorKey: "spesialis"
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