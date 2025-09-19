<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterKodePenyakitController;
use App\Http\Controllers\MasterTindakanController;
use App\Http\Controllers\MasterObatController;
use App\Http\Controllers\MasterKlinikController;
use App\Http\Controllers\MasterDokterController;
use App\Http\Controllers\DokterKlinikController;
use App\Http\Controllers\MasterPasienController;
use App\Http\Controllers\MasterHargaObatController;
use App\Http\Controllers\MasterHargaTindakanController;
use App\Http\Controllers\RekamMedisController;
use App\Http\Controllers\OdontogramController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/check-session', [AuthController::class, 'checkSession']);

Route::get('/master-kode-penyakit', [MasterKodePenyakitController::class, 'index']);
Route::post('/master-kode-penyakit', [MasterKodePenyakitController::class, 'store']);
Route::get('/master-kode-penyakit/list', [MasterKodePenyakitController::class, 'list']);
Route::get('/master-kode-penyakit/{id}', [MasterKodePenyakitController::class, 'show']);
Route::put('/master-kode-penyakit/{id}', [MasterKodePenyakitController::class, 'update']);
Route::delete('/master-kode-penyakit/{id}', [MasterKodePenyakitController::class, 'destroy']);

Route::get('/master-tindakan', [MasterTindakanController::class, 'index']);
Route::post('/master-tindakan', [MasterTindakanController::class, 'store']);
Route::get('/master-tindakan/list', [MasterTindakanController::class, 'list']);
Route::get('/master-tindakan/{id}', [MasterTindakanController::class, 'show']);
Route::put('/master-tindakan/{id}', [MasterTindakanController::class, 'update']);
Route::delete('/master-tindakan/{id}', [MasterTindakanController::class, 'destroy']);

Route::get('/master-obat', [MasterObatController::class, 'index']);
Route::post('/master-obat', [MasterObatController::class, 'store']);
Route::get('/master-obat/list', [MasterObatController::class, 'list']);
Route::get('/master-obat/{id}', [MasterObatController::class, 'show']);
Route::put('/master-obat/{id}', [MasterObatController::class, 'update']);
Route::delete('/master-obat/{id}', [MasterObatController::class, 'destroy']);

Route::prefix('klinik')->group(function () {
    Route::get('/', [MasterKlinikController::class, 'index']);
    Route::post('/', [MasterKlinikController::class, 'store']);
    Route::get('/list', [MasterKlinikController::class, 'list']);
    Route::get('/{id}', [MasterKlinikController::class, 'show']);
    Route::put('/{id}', [MasterKlinikController::class, 'update']);
    Route::delete('/{id}', [MasterKlinikController::class, 'destroy']);
});

Route::prefix('dokter')->group(function () {
    Route::get('/', [MasterDokterController::class, 'index']);
    Route::post('/', [MasterDokterController::class, 'store']);
    Route::get('/list', [MasterDokterController::class, 'list']);
    Route::get('/{id}', [MasterDokterController::class, 'show']);
    Route::put('/{id}', [MasterDokterController::class, 'update']);
    Route::delete('/{id}', [MasterDokterController::class, 'destroy']);
});

// Routes untuk dokter-klinik
Route::prefix('dokter-klinik')->group(function () {
    Route::get('/', [DokterKlinikController::class, 'index']);
    Route::post('/', [DokterKlinikController::class, 'store']);
    Route::get('/{id}', [DokterKlinikController::class, 'show']);
    Route::put('/{id}', [DokterKlinikController::class, 'update']);
    Route::delete('/{id}', [DokterKlinikController::class, 'destroy']);
});

Route::prefix('pasien')->group(function () {
    Route::get('/', [MasterPasienController::class, 'index']);
    Route::post('/', [MasterPasienController::class, 'store']);
    Route::get('/list', [MasterPasienController::class, 'list']);
    Route::get('/generate-rekam-medis', [MasterPasienController::class, 'generateRekamMedis']);
    Route::get('/{id}', [MasterPasienController::class, 'show']);
    Route::put('/{id}', [MasterPasienController::class, 'update']);
    Route::delete('/{id}', [MasterPasienController::class, 'destroy']);
});

// Master Harga Obat Routes
Route::prefix('/master-harga-obat')->group(function () {
    Route::get('/', [MasterHargaObatController::class, 'index']);
    Route::post('/', [MasterHargaObatController::class, 'store']);
    Route::get('/list', [MasterHargaObatController::class, 'list']);
    Route::get('/klinik/{klinikId}', [MasterHargaObatController::class, 'getHargaByKlinik']);
    Route::get('/obat/{obatId}', [MasterHargaObatController::class, 'getHargaByObat']);
    Route::get('/{klinikId}/{obatId}', [MasterHargaObatController::class, 'show']);
    Route::put('/{klinikId}/{obatId}', [MasterHargaObatController::class, 'update']);
    Route::delete('/{klinikId}/{obatId}', [MasterHargaObatController::class, 'destroy']);
});

// Route untuk master harga tindakan
Route::prefix('/master-harga-tindakan')->group(function () {
    Route::get('/', [MasterHargaTindakanController::class, 'index']);
    Route::post('/', [MasterHargaTindakanController::class, 'store']);
    Route::get('/list', [MasterHargaTindakanController::class, 'list']);
    Route::get('/klinik/{klinikId}', [MasterHargaTindakanController::class, 'getHargaByKlinik']);
    Route::get('/tindakan/{tindakanId}', [MasterHargaTindakanController::class, 'getHargaByTindakan']);
    Route::get('/{klinikId}/{tindakanId}', [MasterHargaTindakanController::class, 'show']);
    Route::put('/{klinikId}/{tindakanId}', [MasterHargaTindakanController::class, 'update']);
    Route::delete('/{klinikId}/{tindakanId}', [MasterHargaTindakanController::class, 'destroy']);
});

// Route untuk rekam medis (tindakan)
Route::prefix('tindakan-rekam-medis')->group(function () {
    Route::get('/', [RekamMedisController::class, 'index']);
    Route::post('/', [RekamMedisController::class, 'store']);
    Route::get('/{id}', [RekamMedisController::class, 'show']);
    Route::put('/{id}', [RekamMedisController::class, 'update']);
    Route::put('/{id}/payment', [RekamMedisController::class, 'updatePaymentStatus']);
    Route::delete('/{id}', [RekamMedisController::class, 'destroy']);
    Route::get('/{id}/print', [RekamMedisController::class, 'printRekamMedis']);
});

// Route untuk resep tindakan
Route::prefix('tindakan-resep')->group(function () {
    Route::get('/{id}/print', [RekamMedisController::class, 'printResep']);
});

// Route untuk odontogram
Route::prefix('tindakan-odontogram')->group(function () {
    Route::get('/{pasienId}', [OdontogramController::class, 'getOdontogramPasien']);
    Route::get('/{pasienId}/date/{date}', [OdontogramController::class, 'getOdontogramByDate']);
    Route::post('/', [OdontogramController::class, 'updateOdontogram']);
    Route::post('/batch', [OdontogramController::class, 'updateOdontogramBatch']);
});

Route::get('/pasien/{id}/riwayat-medis', [RekamMedisController::class, 'getRiwayatPasien']);

Route::group(['prefix' => 'dashboard'], function () {
    Route::get('/summary', 'App\Http\Controllers\DashboardController@summary');
    Route::get('/today-schedule', 'App\Http\Controllers\DashboardController@todaySchedule');
    Route::get('/popular-treatments', 'App\Http\Controllers\DashboardController@popularTreatments');
    Route::get('/charts', 'App\Http\Controllers\DashboardController@charts');
    Route::get('/all', 'App\Http\Controllers\DashboardController@all');
});