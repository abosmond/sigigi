<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterDokter extends Model
{
    use HasFactory;
    protected $table = 'dokter';
    protected $primaryKey = 'id_dokter';

    protected $fillable = [
        'nama_dokter',
        'no_str',
        'spesialis',
        'telepon',
        'email',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
