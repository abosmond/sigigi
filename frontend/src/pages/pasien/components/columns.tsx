// src/pages/pasien/components/columns.tsx
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pasien } from "@/services/pasien"
import { format } from "date-fns"

// Interfaces dan Types
interface CellActionProps {
  original: Pasien
  onEdit: (data: Pasien) => void
  onDelete: (data: Pasien) => void
}

type Column = {
  id: string
  header: string
  accessorKey?: keyof Pasien
  cell?: (props: { 
    row: { 
      original: Pasien; 
      index: number 
    }; 
    meta: { 
      onEdit: (data: Pasien) => void; 
      onDelete: (data: Pasien) => void;
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
    id: "no_rekam_medis",
    header: "No. Rekam Medis",
    accessorKey: "no_rekam_medis"
  },
  {
    id: "nama_lengkap",
    header: "Nama Lengkap",
    accessorKey: "nama_lengkap"
  },
  {
    id: "jenis_kelamin",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const gender = row.original.jenis_kelamin;
      return gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";
    }
  },
  {
    id: "tanggal_lahir",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
      const birthDate = row.original.tanggal_lahir;
      if (!birthDate) return "-";
      try {
        return format(new Date(birthDate), "dd/MM/yyyy");
      } catch (error) {
        return birthDate;
      }
    }
  },
  {
    id: "telepon",
    header: "Telepon",
    accessorKey: "telepon"
  },
  {
    id: "alamat",
    header: "Alamat",
    cell: ({ row }) => {
      const alamat = row.original.alamat;
      if (!alamat) return "-";
      // Truncate address if too long
      return alamat.length > 30 ? `${alamat.substring(0, 30)}...` : alamat;
    }
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