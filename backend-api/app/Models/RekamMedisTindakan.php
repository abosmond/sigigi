<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RekamMedisPasien;
use App\Models\MasterKodePenyakit;
use App\Models\MasterTindakan;

class RekamMedisTindakan extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'rekam_medis_tindakan';

    /**
     * Primary key tabel
     *
     * @var string
     */
    protected $primaryKey = null;
    public $incrementing = false;

    /**
     * Composite primary key
     *
     * @var array
     */
    protected $primaryKeys = ['id_rekam_medis', 'id_master_kode_penyakit', 'nomor_gigi', 'posisi_gigi'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_rekam_medis',
        'id_master_kode_penyakit',
        'id_master_tindakan',
        'nomor_gigi',
        'posisi_gigi',
        'catatan_tindakan'
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
     * Get the rekam medis that owns the tindakan
     */
    public function rekamMedis()
    {
        return $this->belongsTo(RekamMedisPasien::class, 'id_rekam_medis', 'id_rekam_medis');
    }

    /**
     * Get the kode penyakit related to the tindakan
     */
    public function kodePenyakit()
    {
        return $this->belongsTo(MasterKodePenyakit::class, 'id_master_kode_penyakit', 'id_master_kode_penyakit');
    }

    /**
     * Get the tindakan data related to the rekam medis tindakan
     */
    public function tindakan()
    {
        return $this->belongsTo(MasterTindakan::class, 'id_master_tindakan', 'id_master_tindakan');
    }
}