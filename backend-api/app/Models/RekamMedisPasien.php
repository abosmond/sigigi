<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterPasien;
use App\Models\DokterKlinik;
use App\Models\RekamMedisTindakan;
use App\Models\ResepTindakan;

class RekamMedisPasien extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'rekam_medis_pasien';

    /**
     * Primary key tabel
     *
     * @var string
     */
    protected $primaryKey = 'id_rekam_medis';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_pasien',
        'id_dokter_klinik',
        'tanggal_kunjungan',
        'keluhan',
        'catatan_dokter',
        'biaya',
        'status_pembayaran'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'tanggal_kunjungan' => 'datetime',
        'biaya' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the pasien data for the rekam medis
     */
    public function pasien()
    {
        return $this->belongsTo(MasterPasien::class, 'id_pasien', 'id_pasien');
    }

    /**
     * Get the dokter klinik data for the rekam medis
     */
    public function dokterKlinik()
    {
        return $this->belongsTo(DokterKlinik::class, 'id_dokter_klinik', 'id_dokter_klinik');
    }

    /**
     * Get the tindakan related to the rekam medis
     */
    public function tindakan()
    {
        return $this->hasMany(RekamMedisTindakan::class, 'id_rekam_medis', 'id_rekam_medis');
    }

    /**
     * Get the resep related to the rekam medis
     */
    public function resep()
    {
        return $this->hasMany(ResepTindakan::class, 'id_rekam_medis', 'id_rekam_medis');
    }
}