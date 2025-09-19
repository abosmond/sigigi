<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'users'; // Nama tabel di database
    protected $primaryKey = 'id_users'; // Primary Key

    public $timestamps = true; // Gunakan created_at & updated_at

    protected $fillable = [
        'username',
        'passwords',
        'nama_lengkap'
    ];

    protected $hidden = [
        'passwords'
    ];
}