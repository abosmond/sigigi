<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterPasien extends Model
{
    use HasFactory;
    protected $table = 'pasien';
    protected $primaryKey = 'id_pasien';

    protected $fillable = [
        'id_klinik',
        'no_rekam_medis',
        'nama_lengkap',
        'nik',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'telepon',
        'email',
        'golongan_darah',
        'kontak_darurat_nama',
        'kontak_darurat_telepon',
        'kontak_darurat_relasi',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi dengan Klinik
    public function klinik()
    {
        return $this->belongsTo(MasterKlinik::class, 'id_klinik', 'id_klinik');
    }
}