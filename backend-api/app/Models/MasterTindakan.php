<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterTindakan extends Model
{
    use HasFactory;

    protected $table = 'master_tindakan';
    protected $primaryKey = 'id_master_tindakan';

    public $timestamps = false;

    protected $fillable = [        
        'nama_tindakan'
    ];

    public function hargaTindakan()
    {
        return $this->hasMany(MasterHargaTindakan::class, 'id_master_tindakan', 'id_master_tindakan');
    }
}
