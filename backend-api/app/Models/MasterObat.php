<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterObat extends Model
{
    use HasFactory;

    protected $table = 'master_obat';
    protected $primaryKey = 'id_obat';

    public $timestamps = TRUE;

    protected $fillable = [        
        'nama_obat',
		'satuan',
		'dosis',
		'keterangan'
    ];
		
	protected $casts = [
		'created_at' => 'datetime',
		'updated_at' => 'datetime'
	];
}
