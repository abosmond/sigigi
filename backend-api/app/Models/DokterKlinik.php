<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\models\MasterDokter;
use App\models\MasterKlinik;

class DokterKlinik extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'dokter_klinik';

    /**
     * Primary key tabel
     *
     * @var string
     */
    protected $primaryKey = 'id_dokter_klinik';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_dokter',
        'id_klinik',
        'no_sip',
        'jadwal_praktek',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the dokter that owns the dokter_klinik
     */
    public function dokter()
    {
        return $this->belongsTo(MasterDokter::class, 'id_dokter', 'id_dokter');
    }

    /**
     * Get the klinik that owns the dokter_klinik
     */
    public function klinik()
    {
        return $this->belongsTo(MasterKlinik::class, 'id_klinik', 'id_klinik');
    }
}