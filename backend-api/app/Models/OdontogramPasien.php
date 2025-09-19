<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterPasien;

class OdontogramPasien extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'odontogram_pasien';

    /**
     * Primary key tabel
     * Composite primary key ditangani dengan properti custom
     *
     * @var string
     */
    protected $primaryKey = null;
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_pasien',
        'tanggal_periksa',
        'nomor_gigi',
        'posisi_gigi',
        'kondisi_gigi',
        'warna_odontogram',
        'keterangan'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'tanggal_periksa' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the pasien data for the odontogram
     */
    public function pasien()
    {
        return $this->belongsTo(MasterPasien::class, 'id_pasien', 'id_pasien');
    }

    /**
     * Override method to handle composite primary key
     * 
     * @return array
     */
    protected function getKeyForSaveQuery()
    {
        $keys = [];
        foreach (['id_pasien', 'nomor_gigi', 'posisi_gigi', 'tanggal_periksa'] as $key) {
            $keys[$key] = $this->original[$key] ?? $this->getAttribute($key);
        }

        return $keys;
    }
}