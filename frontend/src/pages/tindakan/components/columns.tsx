import { ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TreatmentData, PrescriptionData } from '@/services/tindakan-medis';

// Kolom untuk tabel tindakan
export const treatmentColumns = (
  onDelete: (index: number) => void
): ColumnDef<TreatmentData>[] => [
  {
    accessorKey: 'location',
    header: 'Lokasi',
    cell: ({ row }) => {
      const location = row.original.location;
      return (
        <div className="font-medium">
          {location ? location : "Umum"}
        </div>
      );
    },
  },
  {
    accessorKey: 'treatmentName',
    header: 'Tindakan',
    cell: ({ row }) => {
      return <div>{row.getValue('treatmentName')}</div>;
    },
  },
  {
    accessorKey: 'diseaseName',
    header: 'Kode Penyakit',
    cell: ({ row }) => {
      return <div>{row.getValue('diseaseName')}</div>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Jumlah',
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('quantity')}</div>;
    },
  },
  {
    accessorKey: 'unitCost',
    header: 'Biaya Satuan',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('unitCost') as string);
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: 'totalCost',
    header: 'Total',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalCost') as string);
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.index)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      );
    },
  },
];

// Kolom untuk tabel resep obat
export const prescriptionColumns = (
  onDelete: (index: number) => void
): ColumnDef<PrescriptionData>[] => [
  {
    accessorKey: 'drugName',
    header: 'Nama Obat',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('drugName')}</div>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Jumlah',
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number;
      const unit = row.original.unit;
      return <div>{quantity} {unit}</div>;
    },
  },
  {
    accessorKey: 'dosage',
    header: 'Aturan Pakai',
    cell: ({ row }) => {
      return <div>{row.getValue('dosage')}</div>;
    },
  },
  {
    accessorKey: 'cost',
    header: 'Biaya',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('cost') as string);
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'notes',
    header: 'Catatan',
    cell: ({ row }) => {
      return <div className="truncate max-w-xs">{row.getValue('notes') || '-'}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.index)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      );
    },
  },
];