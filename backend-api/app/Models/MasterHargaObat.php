<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterObat;
use App\Models\MasterKlinik;

class MasterHargaObat extends Model
{
    /**
     * Nama tabel yang digunakan model
     *
     * @var string
     */
    protected $table = 'master_harga_obat';

    /**
     * Primary key tabel
     * 
     * @var string
     */
    // Laravel tidak mendukung langsung composite key, gunakan string sebagai primary key
    // dan implementasi kustom untuk operasi
    protected $primaryKey = 'id_klinik'; // Gunakan salah satu kolom sebagai primaryKey default

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_klinik',
        'id_obat',
        'harga',
        'keterangan',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'harga' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Get the obat that owns the harga
     */
    public function obat()
    {
        return $this->belongsTo(MasterObat::class, 'id_obat', 'id_obat');
    }

    /**
     * Get the klinik that owns the harga
     */
    public function klinik()
    {
        return $this->belongsTo(MasterKlinik::class, 'id_klinik', 'id_klinik');
    }
    
    /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if(!is_array($keys)){
            return parent::setKeysForSaveQuery($query);
        }

        foreach($keys as $keyName){
            $query->where($keyName, '=', $this->getKeyForSaveQuery($keyName));
        }

        return $query;
    }

    /**
     * Get the primary key value for a save query.
     *
     * @param mixed $keyName
     * @return mixed
     */
    protected function getKeyForSaveQuery($keyName = null)
    {
        if(is_null($keyName)){
            $keyName = $this->getKeyName();
        }

        if (isset($this->original[$keyName])) {
            return $this->original[$keyName];
        }

        return $this->getAttribute($keyName);
    }
}