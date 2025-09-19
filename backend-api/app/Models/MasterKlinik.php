<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterKlinik extends Model
{
    use HasFactory;

    protected $table = 'klinik';
    protected $primaryKey = 'id_klinik';

    protected $fillable = [
        'id_klinik',
        'nama_klinik',
        'alamat_klinik',
        'telepon',
        'email',
        'no_izin_klinik',
        'jam_operasional',
    ];

    protected $casts = [
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime'
    ];
}
