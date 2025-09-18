import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Interface untuk data Odontogram
interface OdontogramToothCondition {
  id_pasien: number;
  tanggal_periksa: string;
  nomor_gigi: string;
  posisi_gigi: string;
  kondisi_gigi: string;
  warna_odontogram: string;
  keterangan?: string;
}

interface OdontogramProps {
  data: OdontogramToothCondition[];
  onSelectTooth: (toothNumber: string, position: string) => void;
}

// Definisi untuk semua nomor gigi
const teethNumbers = {
  adult: {
    upper: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
    lower: ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']
  },
  child: {
    upper: ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'],
    lower: ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75']
  }
};

// Definisi posisi gigi
const toothPositions = [
  { id: 'M', label: 'Mesial', position: 'top-left' },
  { id: 'O', label: 'Occlusal', position: 'center' },
  { id: 'D', label: 'Distal', position: 'top-right' },
  { id: 'B', label: 'Buccal', position: 'bottom' },
  { id: 'L', label: 'Lingual', position: 'top' },
  { id: 'P', label: 'Palatal', position: 'top' },
  { id: 'R', label: 'Root', position: 'bottom-center' }
];

// Komponen gigi untuk odontogram
// Komponen gigi untuk odontogram
const Tooth: React.FC<{
  number: string;
  conditions: OdontogramToothCondition[];
  onSelect: (toothNumber: string, position: string) => void;
}> = ({ number, conditions, onSelect }) => {
  const [showPositions, setShowPositions] = useState(false);
  
  // Pastikan conditions adalah array
  const safeConditions = Array.isArray(conditions) ? conditions : [];
  
  // Mapping kondisi gigi ke warna
  const getToothColor = (position: string) => {
    const condition = safeConditions.find(c => c.nomor_gigi === number && c.posisi_gigi === position);
    return condition ? condition.warna_odontogram : '#FFFFFF';
  };

  // Handler for tooth click
  const handleToothClick = () => {
    setShowPositions(true);
  };

  return (
    <div className="relative">
      {/* Tooth Visualization */}
      <div 
        className="w-14 h-16 border border-gray-400 rounded-sm flex flex-col cursor-pointer hover:bg-gray-100"
        onClick={handleToothClick}
        title={`Gigi ${number}`}
      >
        {/* Nomor gigi */}
        <div className="text-xs font-medium text-center bg-gray-200 border-b border-gray-400">
          {number}
        </div>
        
        {/* Representasi visual gigi */}
        <div className="flex-1 relative">
          {/* Mesial */}
          <div 
            className="absolute top-0 left-0 w-1/3 h-1/2 border-r border-b border-gray-400"
            style={{ backgroundColor: getToothColor('M') }}
          />
          
          {/* Occlusal */}
          <div 
            className="absolute top-0 left-1/3 w-1/3 h-1/2 border-r border-b border-gray-400"
            style={{ backgroundColor: getToothColor('O') }}
          />
          
          {/* Distal */}
          <div 
            className="absolute top-0 right-0 w-1/3 h-1/2 border-b border-gray-400"
            style={{ backgroundColor: getToothColor('D') }}
          />
          
          {/* Buccal */}
          <div 
            className="absolute bottom-0 left-0 w-1/2 h-1/2 border-r border-gray-400"
            style={{ backgroundColor: getToothColor('B') }}
          />
          
          {/* Lingual/Palatal */}
          <div 
            className="absolute bottom-0 right-0 w-1/2 h-1/2"
            style={{ backgroundColor: getToothColor('L') }}
          />
        </div>
      </div>

      {/* Position Selection Dialog */}
      <Dialog open={showPositions} onOpenChange={setShowPositions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Posisi Gigi {number}</DialogTitle>
            <DialogDescription>
              Klik posisi gigi yang akan ditindak
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 p-4">
            {toothPositions.map(pos => (
              <Button
                key={pos.id}
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  onSelect(number, pos.id);
                  setShowPositions(false);
                }}
              >
                {pos.label} ({pos.id})
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Komponen utama Odontogram
// Komponen utama Odontogram
export const Odontogram: React.FC<OdontogramProps> = ({ data, onSelectTooth }) => {
  const [showTab, setShowTab] = useState<'adult' | 'child'>('adult');
  
  // Pastikan data adalah array
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button 
            variant={showTab === 'adult' ? 'default' : 'outline'} 
            onClick={() => setShowTab('adult')}
            size="sm"
          >
            Gigi Permanen
          </Button>
          <Button 
            variant={showTab === 'child' ? 'default' : 'outline'} 
            onClick={() => setShowTab('child')}
            size="sm"
          >
            Gigi Susu
          </Button>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Panduan Odontogram</p>
              <p className="text-xs mt-1">Klik pada gigi untuk memilih posisi gigi yang akan ditindak</p>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li>M = Mesial (depan)</li>
                <li>D = Distal (belakang)</li>
                <li>O = Occlusal (permukaan kunyah)</li>
                <li>B = Buccal (sisi pipi)</li>
                <li>L/P = Lingual/Palatal (sisi lidah/langit-langit)</li>
                <li>R = Root (akar)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Gigi rahang atas */}
      <div className="mb-4">
        <div className="text-center font-medium mb-2">Rahang Atas</div>
        <div className="flex flex-wrap justify-center gap-1">
          {teethNumbers[showTab].upper.map(number => (
            <Tooth 
              key={number} 
              number={number} 
              conditions={safeData.filter(d => d.nomor_gigi === number)}
              onSelect={onSelectTooth}
            />
          ))}
        </div>
      </div>
      
      {/* Gigi rahang bawah */}
      <div>
        <div className="text-center font-medium mb-2">Rahang Bawah</div>
        <div className="flex flex-wrap justify-center gap-1">
          {teethNumbers[showTab].lower.map(number => (
            <Tooth 
              key={number} 
              number={number} 
              conditions={safeData.filter(d => d.nomor_gigi === number)}
              onSelect={onSelectTooth}
            />
          ))}
        </div>
      </div>
      
      {/* Legenda warna */}
      <div className="mt-6">
        <div className="text-center font-medium mb-2">Legenda Kondisi Gigi</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-400 mr-2"></div>
            <span className="text-sm">Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-sm">Karies</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span className="text-sm">Tambalan</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
            <span className="text-sm">Gigi Tiruan</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-black mr-2"></div>
            <span className="text-sm">Missing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-sm">Perawatan Saluran Akar</span>
          </div>
        </div>
      </div>
    </div>
  );
};