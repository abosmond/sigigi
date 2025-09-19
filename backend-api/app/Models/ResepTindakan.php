<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RekamMedisPasien;
use App\Models\MasterObat;

class ResepTindakan extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'resep_tindakan';

    /**
     * Primary key tabel
     * 
     * Composite primary key ditangani dengan override method getKeyName
     *
     * @var string
     */
    protected $primaryKey = 'id_resep_tindakan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_resep_tindakan',
        'id_rekam_medis',
        'id_obat',
        'jumlah',
        'aturan_pakai',
        'catatan'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'jumlah' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the rekam medis that owns the resep
     */
    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedisPasien::class, 'id_rekam_medis', 'id_rekam_medis');
    }

    /**
     * Get the obat data related to the resep
     */
    public function obat()
    {
        return $this->belongsTo(MasterObat::class, 'id_obat', 'id_obat');
    }
}