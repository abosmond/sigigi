// src/pages/master/tindakan/components/data-table.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
  import { Tindakan } from "@/services/tindakan"
  
  type Column = {
    id: string
    header: string
    accessorKey?: keyof Tindakan
    cell?: (props: { row: { original: Tindakan; index: number }; meta: { onEdit: (data: Tindakan) => void; onDelete: (data: Tindakan) => void; currentPage: number; itemsPerPage: number} }) => React.ReactNode
  }
  
  interface DataTableProps {
    columns: Column[]
    data: Tindakan[]
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onEdit: (data: Tindakan) => void
    onDelete: (data: Tindakan) => void
    loading?: boolean
  }
  
  export function DataTable({
    columns,
    data,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    loading = false,
  }: DataTableProps) {
  
    const itemsPerPage = 10; // Sesuaikan dengan limit di backend
  
    const meta = {
      onEdit,
      onDelete,
      currentPage: Number(currentPage),
      itemsPerPage
    };
  
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.cell 
                          ? column.cell({ 
                              row: { 
                                original: row, 
                                index: rowIndex 
                              }, 
                              meta 
                            })
                          : column.accessorKey 
                            ? row[column.accessorKey]
                            : null
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
  
        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
  