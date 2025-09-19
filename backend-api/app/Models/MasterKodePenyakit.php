<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterKodePenyakit extends Model
{
    use HasFactory;

    protected $table = 'master_kode_penyakit';
    protected $primaryKey = 'id_master_kode_penyakit';

    public $timestamps = false;

    protected $fillable = [        
        'nama_penyakit'
    ];
}
