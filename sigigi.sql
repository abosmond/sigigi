/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.3.0 : Database - ortho-clinic-simple
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `cache` */

DROP TABLE IF EXISTS `cache`;

CREATE TABLE `cache` (
  `key` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM;

/*Data for the table `cache` */

/*Table structure for table `cache_locks` */

DROP TABLE IF EXISTS `cache_locks`;

CREATE TABLE `cache_locks` (
  `key` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM;

/*Data for the table `cache_locks` */

/*Table structure for table `dokter` */

DROP TABLE IF EXISTS `dokter`;

CREATE TABLE `dokter` (
  `id_dokter` int NOT NULL AUTO_INCREMENT,
  `nama_dokter` varchar(100) NOT NULL,
  `no_str` varchar(50) DEFAULT NULL,
  `spesialis` varchar(50) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dokter`)
) ENGINE=MyISAM AUTO_INCREMENT=2;

/*Data for the table `dokter` */

insert  into `dokter`(`id_dokter`,`nama_dokter`,`no_str`,`spesialis`,`telepon`,`email`,`created_at`,`updated_at`) values 
(1,'Marlin Himawati','1234567','Orthodonsia','087838595695','mrlnhmwt@gmail.com','2025-02-25 04:22:24','2025-02-25 04:22:40');

/*Table structure for table `dokter_klinik` */

DROP TABLE IF EXISTS `dokter_klinik`;

CREATE TABLE `dokter_klinik` (
  `id_dokter_klinik` int NOT NULL AUTO_INCREMENT,
  `id_dokter` int NOT NULL,
  `id_klinik` int NOT NULL,
  `no_sip` varchar(50) DEFAULT NULL,
  `jadwal_praktek` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dokter_klinik`),
  KEY `id_dokter` (`id_dokter`),
  KEY `id_klinik` (`id_klinik`)
) ENGINE=MyISAM AUTO_INCREMENT=3;

/*Data for the table `dokter_klinik` */

insert  into `dokter_klinik`(`id_dokter_klinik`,`id_dokter`,`id_klinik`,`no_sip`,`jadwal_praktek`,`created_at`,`updated_at`) values 
(1,1,2,'12345678','Senin-Kamis: 16.00 - 20.00, Sabtu: 16.00 - 18.00','2025-02-25 07:07:06','2025-02-25 07:07:06'),
(2,1,1,'123456789','Jumat: 16.00 - 20.00','2025-02-25 07:10:56','2025-02-25 07:10:56');

/*Table structure for table `jobs` */

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

/*Data for the table `jobs` */

/*Table structure for table `klinik` */

DROP TABLE IF EXISTS `klinik`;

CREATE TABLE `klinik` (
  `id_klinik` int NOT NULL AUTO_INCREMENT,
  `nama_klinik` varchar(100) NOT NULL,
  `alamat_klinik` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_izin_klinik` varchar(50) DEFAULT NULL,
  `jam_operasional` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_klinik`)
) ENGINE=MyISAM AUTO_INCREMENT=3;

/*Data for the table `klinik` */

insert  into `klinik`(`id_klinik`,`nama_klinik`,`alamat_klinik`,`telepon`,`email`,`no_izin_klinik`,`jam_operasional`,`created_at`,`updated_at`) values 
(1,'Klinik Lembang','Jl. Grand Hotel No. 70, Lembang',NULL,'abosmond2@gmail.com',NULL,'16.00 - 20.00','2025-02-21 15:44:13','2025-02-21 15:44:13'),
(2,'Klinik Cibadak','Jl. Cibadak 194, Bandung',NULL,'abosmond2@gmail.com',NULL,'16.00 - 20.00','2025-02-21 15:44:57','2025-02-21 15:44:57');

/*Table structure for table `master_harga_obat` */

DROP TABLE IF EXISTS `master_harga_obat`;

CREATE TABLE `master_harga_obat` (
  `id_klinik` int NOT NULL,
  `id_obat` int NOT NULL,
  `harga` int NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_klinik`,`id_obat`),
  KEY `id_obat` (`id_obat`)
) ENGINE=InnoDB;

/*Data for the table `master_harga_obat` */

insert  into `master_harga_obat`(`id_klinik`,`id_obat`,`harga`,`keterangan`,`created_at`,`updated_at`) values 
(1,1,5000,'harga per strip','2025-02-14 22:05:04','2025-03-04 12:43:43'),
(1,2,3000,'harga per strip.','2025-02-14 22:05:04','2025-03-04 05:12:10'),
(1,3,25000,'harga per strip.','2025-02-14 22:05:04','2025-03-04 05:12:10'),
(1,4,4000,'harga per strip.','2025-02-14 22:05:04','2025-03-04 05:12:10'),
(1,5,20000,'harga per strip.','2025-02-14 22:05:04','2025-03-04 05:12:10'),
(2,1,5300,'harga per strip','2025-02-14 22:05:04','2025-03-04 05:20:36'),
(2,2,5300,'harga per strip','2025-02-14 22:05:04','2025-03-04 05:20:36'),
(2,3,5300,'harga per strip','2025-02-14 22:05:04','2025-03-04 05:20:36'),
(2,4,5300,'harga per strip','2025-02-14 22:05:04','2025-03-04 05:20:36'),
(2,5,5300,'harga per strip','2025-02-14 22:05:04','2025-03-04 05:20:36');

/*Table structure for table `master_harga_tindakan` */

DROP TABLE IF EXISTS `master_harga_tindakan`;

CREATE TABLE `master_harga_tindakan` (
  `id_klinik` int NOT NULL,
  `id_master_tindakan` int NOT NULL,
  `harga` int NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_klinik`,`id_master_tindakan`),
  KEY `id_master_tindakan` (`id_master_tindakan`)
) ENGINE=InnoDB;

/*Data for the table `master_harga_tindakan` */

insert  into `master_harga_tindakan`(`id_klinik`,`id_master_tindakan`,`harga`,`keterangan`,`created_at`,`updated_at`) values 
(1,1,3500000,'Pemasangan kawat gigi Ceramic','2025-02-14 21:57:08','2025-02-14 21:57:08'),
(1,2,2500000,'Pemasangan kawat gigi Metal','2025-02-14 21:57:08','2025-02-14 21:57:08'),
(1,3,150000,'Kontrol rutin kawat gigi','2025-02-14 21:57:08','2025-02-14 21:57:08'),
(1,18,250000,'Tambal gigi biasa','2025-02-14 21:57:08','2025-02-14 21:57:08'),
(2,1,3500000,'Pemasangan kawat gigi.','2025-03-11 14:57:37','2025-03-11 14:57:37');

/*Table structure for table `master_kode_penyakit` */

DROP TABLE IF EXISTS `master_kode_penyakit`;

CREATE TABLE `master_kode_penyakit` (
  `id_master_kode_penyakit` int NOT NULL AUTO_INCREMENT,
  `nama_penyakit` varchar(100) NOT NULL,
  PRIMARY KEY (`id_master_kode_penyakit`)
) ENGINE=MyISAM AUTO_INCREMENT=116;

/*Data for the table `master_kode_penyakit` */

insert  into `master_kode_penyakit`(`id_master_kode_penyakit`,`nama_penyakit`) values 
(1,'Anodontia - K00.0'),
(2,'Gigi berlebih - K00.1'),
(3,'Kelainan ukuran dan bentuk gigi - K00.2'),
(4,'Gigi berbintik - K00.3'),
(5,'Gangguan pembentukan gigi - K00.4'),
(6,'Kelainan herediter struktur gigi - K00.5'),
(7,'Gangguan erupsi gigi - K00.6'),
(8,'Sindrom erupsi gigi - K00.7'),
(9,'Gangguan perkembangan gigi lainnya - K00.8'),
(10,'Gangguan perkembangan gigi yang tidak spesifik - K00.9'),
(11,'Gigi terpendam - K01.0'),
(12,'Gigi tumbuh sebagian - K01.1'),
(13,'Karies yang terbatas pada email - K02.0'),
(14,'Karies dentin - K02.1'),
(15,'Karies sementum - K02.2'),
(16,'Karies yang terhenti - K02.3'),
(17,'Odontoclasia - K02.4'),
(18,'Karies dengan pulpa terbuka - K02.5'),
(19,'Karies gigi lainnya - K02.8'),
(20,'Karies gigi yang tidak spesifik - K02.9'),
(21,'Atrisi gigi yang berlebihan - K03.0'),
(22,'Abrasi gigi - K03.1'),
(23,'Erosi gigi - K03.2'),
(24,'Resorpsi gigi patologis - K03.3'),
(25,'Hipersementosis - K03.4'),
(26,'Ankilosis gigi - K03.5'),
(27,'Deposit pada gigi - K03.6'),
(28,'Perubahan warna jaringan keras gigi setelah erupsi - K03.7'),
(29,'Penyakit jaringan keras gigi spesifik lainnya - K03.8'),
(30,'Penyakit jaringan keras gigi yang tidak spesifik - K03.9'),
(31,'Pulpitis - K04.0'),
(32,'Nekrosis pulpa - K04.1'),
(33,'Degenerasi pulpa - K04.2'),
(34,'Pembentukan jaringan keras abnormal dalam pulpa - K04.3'),
(35,'Periodontitis apikal akut dari pulpa - K04.4'),
(36,'Periodontitis apikal kronis - K04.5'),
(37,'Abses periapikal dengan sinus - K04.6'),
(38,'Abses periapikal tanpa sinus - K04.7'),
(39,'Kista radikuler - K04.8'),
(40,'Penyakit pulpa dan periapikal lainnya - K04.9'),
(41,'Gingivitis akut - K05.0'),
(42,'Gingivitis kronis - K05.1'),
(43,'Periodontitis akut - K05.2'),
(44,'Periodontitis kronis - K05.3'),
(45,'Periodontosis - K05.4'),
(46,'Penyakit periodontal lainnya - K05.5'),
(47,'Penyakit periodontal yang tidak spesifik - K05.6'),
(48,'Resesi gingiva - K06.0'),
(49,'Pembesaran gingiva - K06.1'),
(50,'Cedera gingiva dan ridge alveolar tidak bergigi - K06.2'),
(51,'Gangguan gingiva dan ridge alveolar tidak bergigi lainnya - K06.8'),
(52,'Gangguan gingiva dan ridge alveolar tidak bergigi yang tidak spesifik - K06.9'),
(53,'Anomali ukuran rahang utama - K07.0'),
(54,'Anomali hubungan rahang-dasar tengkorak - K07.1'),
(55,'Anomali hubungan lengkung gigi - K07.2'),
(56,'Anomali posisi gigi - K07.3'),
(57,'Maloklusi yang tidak spesifik - K07.4'),
(58,'Abnormalitas dentofasial fungsional - K07.5'),
(59,'Gangguan sendi temporomandibular - K07.6'),
(60,'Anomali dentofasial lainnya - K07.8'),
(61,'Anomali dentofasial yang tidak spesifik - K07.9'),
(62,'Kehilangan gigi karena penyebab sistemik - K08.0'),
(63,'Kehilangan gigi karena kecelakaan atau ekstraksi - K08.1'),
(64,'Atrofi ridge alveolar tidak bergigi - K08.2'),
(65,'Akar gigi yang tertinggal - K08.3'),
(66,'Gangguan gigi dan struktur pendukung lainnya yang spesifik - K08.8'),
(67,'Gangguan gigi dan struktur pendukung yang tidak spesifik - K08.9'),
(68,'Kista odontogenik perkembangan - K09.0'),
(69,'Kista perkembangan non-odontogenik daerah mulut - K09.1'),
(70,'Kista rahang lainnya - K09.2'),
(71,'Kista daerah mulut lainnya - K09.8'),
(72,'Kista daerah mulut yang tidak spesifik - K09.9'),
(73,'Gangguan perkembangan rahang - K10.0'),
(74,'Granuloma sel raksasa sentral - K10.1'),
(75,'Kondisi inflamasi rahang - K10.2'),
(76,'Alveolitis rahang - K10.3'),
(77,'Penyakit rahang spesifik lainnya - K10.8'),
(78,'Penyakit rahang yang tidak spesifik - K10.9'),
(79,'Atrofi kelenjar liur - K11.0'),
(80,'Hipertrofi kelenjar liur - K11.1'),
(81,'Sialadenitis - K11.2'),
(82,'Abses kelenjar liur - K11.3'),
(83,'Fistula kelenjar liur - K11.4'),
(84,'Sialolitiasis - K11.5'),
(85,'Mukokel kelenjar liur - K11.6'),
(86,'Gangguan sekresi liur - K11.7'),
(87,'Penyakit kelenjar liur lainnya - K11.8'),
(88,'Penyakit kelenjar liur yang tidak spesifik - K11.9'),
(89,'Stomatitis aftosa rekuren - K12.0'),
(90,'Bentuk lain dari stomatitis - K12.1'),
(91,'Selulitis dan abses mulut - K12.2'),
(92,'Mukositis oral - K12.3'),
(93,'Penyakit bibir - K13.0'),
(94,'Gigitan pipi dan bibir - K13.1'),
(95,'Leukoplakia dan gangguan epitel mulut lainnya - K13.2'),
(96,'Leukoplakia berbulu - K13.3'),
(97,'Lesi granuloma dan granuloma-like mukosa mulut - K13.4'),
(98,'Fibrosis submukosa mulut - K13.5'),
(99,'Hiperplasia iritasi mukosa mulut - K13.6'),
(100,'Lesi mukosa mulut lainnya - K13.7'),
(101,'Glositis - K14.0'),
(102,'Lidah geografik - K14.1'),
(103,'Glossitis rhomboid mediana - K14.2'),
(104,'Hipertrofi papila lidah - K14.3'),
(105,'Atrofi papila lidah - K14.4'),
(106,'Lidah terlipat - K14.5'),
(107,'Glosodinia - K14.6'),
(108,'Penyakit lidah lainnya - K14.8'),
(109,'Penyakit lidah yang tidak spesifik - K14.9');

/*Table structure for table `master_obat` */

DROP TABLE IF EXISTS `master_obat`;

CREATE TABLE `master_obat` (
  `id_obat` int NOT NULL AUTO_INCREMENT,
  `nama_obat` varchar(100) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obat`)
) ENGINE=MyISAM AUTO_INCREMENT=7;

/*Data for the table `master_obat` */

insert  into `master_obat`(`id_obat`,`nama_obat`,`satuan`,`dosis`,`keterangan`,`created_at`,`updated_at`) values 
(1,'Amoxicillin','Tablet','500mg','Antibiotik','2025-02-14 22:05:04','2025-02-14 22:05:04'),
(2,'Paracetamol','Tablet','500mg','Analgesik','2025-02-14 22:05:04','2025-02-14 22:05:04'),
(3,'Chlorhexidine','Botol','100ml','Obat kumur antiseptik','2025-02-14 22:05:04','2025-02-14 22:05:04'),
(4,'Ibuprofen','Tablet','400mg','Anti inflamasi','2025-02-14 22:05:04','2025-02-14 22:05:04'),
(5,'Betadine Gargle','Botol','100ml','Obat kumur antiseptik','2025-02-14 22:05:04','2025-02-14 22:05:04');

/*Table structure for table `master_tindakan` */

DROP TABLE IF EXISTS `master_tindakan`;

CREATE TABLE `master_tindakan` (
  `id_master_tindakan` int NOT NULL AUTO_INCREMENT,
  `nama_tindakan` varchar(150) NOT NULL,
  PRIMARY KEY (`id_master_tindakan`)
) ENGINE=MyISAM AUTO_INCREMENT=62;

/*Data for the table `master_tindakan` */

insert  into `master_tindakan`(`id_master_tindakan`,`nama_tindakan`) values 
(1,'Aplikasi alat ortodonti untuk ketidakteraturan gigi minor - 24.71'),
(2,'Aplikasi alat ortodonti untuk ketidakteraturan gigi major - 24.72'),
(3,'Penyesuaian alat ortodonti - 24.70'),
(4,'Pemasangan kawat gigi cekat - 24.7'),
(5,'Pemasangan alat ortodonti lepasan - 24.7'),
(6,'Operasi ortognatik - 24.8'),
(7,'Ekstraksi gigi dengan forsep - 23.0'),
(8,'Ekstraksi gigi yang tersisa dengan forsep - 23.01'),
(9,'Pengangkatan gigi secara bedah - 23.1'),
(10,'Pengangkatan akar gigi secara bedah - 23.11'),
(11,'Insisi dan drainase abses - 24.0'),
(12,'Operasi gigi bungsu impaksi - 23.19'),
(13,'Biopsi lesi rongga mulut - 24.11'),
(14,'Operasi kista rahang - 24.4'),
(15,'Bedah preprostetik - 24.5'),
(16,'Perawatan saluran akar single - 23.70'),
(17,'Perawatan saluran akar multiple - 23.71'),
(18,'Restorasi gigi dengan tambalan - 23.2'),
(19,'Restorasi gigi dengan mahkota - 23.3'),
(20,'Apikoektomi - 23.73'),
(21,'Perawatan pulpa vital - 23.76'),
(22,'Bleaching internal - 23.77'),
(23,'Kuretase gingiva - 24.31'),
(24,'Operasi flap periodontal - 24.32'),
(25,'Gingivektomi - 24.2'),
(26,'Gingivoplasti - 24.2'),
(27,'Bedah mukogingival - 24.39'),
(28,'Perawatan poket periodontal - 24.33'),
(29,'Splinting gigi goyah - 24.34'),
(30,'Pemasangan gigi tiruan penuh - 23.42'),
(31,'Pemasangan gigi tiruan sebagian lepasan - 23.43'),
(32,'Pemasangan bridge - 23.41'),
(33,'Pemasangan implant gigi - 23.5'),
(34,'Pemasangan abutment implant - 23.6'),
(35,'Penyesuaian gigi tiruan - 24.6'),
(36,'Reline gigi tiruan - 24.61'),
(37,'Rebase gigi tiruan - 24.62'),
(38,'Perawatan pulpotomi gigi sulung - 23.74'),
(39,'Perawatan pulpektomi gigi sulung - 23.75'),
(40,'Aplikasi topikal fluoride - 23.81'),
(41,'Sealant gigi anak - 23.82'),
(42,'Space maintainer - 24.7'),
(43,'Restorasi gigi sulung - 23.2'),
(44,'Ekstraksi gigi sulung - 23.01'),
(45,'Biopsi lesi mukosa - 24.11'),
(46,'Eksisi lesi jinak rongga mulut - 24.41'),
(47,'Perawatan kandidiasis oral - 24.91'),
(48,'Perawatan stomatitis - 24.92'),
(49,'Laser terapi lesi mulut - 24.93'),
(50,'Krioterapi lesi mulut - 24.94'),
(51,'Radiografi periapikal - 87.11'),
(52,'Radiografi panoramik - 87.12'),
(53,'Radiografi sefalometri - 87.13'),
(54,'CT Scan dental - 87.14'),
(55,'CBCT imaging - 87.15'),
(56,'Pencatatan data gigi post mortem - 23.91'),
(57,'Analisis bite mark - 23.92'),
(58,'Identifikasi gigi - 23.93'),
(59,'Analisis rugae palatina - 23.94'),
(60,'Analisis DNA gigi - 23.95');

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5;

/*Data for the table `migrations` */

insert  into `migrations`(`id`,`migration`,`batch`) values 
(3,'0001_01_01_000000_create_users_table',1),
(4,'0001_01_01_000001_create_cache_table',1);

/*Table structure for table `odontogram_pasien` */

DROP TABLE IF EXISTS `odontogram_pasien`;

CREATE TABLE `odontogram_pasien` (
  `id_pasien` int NOT NULL,
  `tanggal_periksa` datetime NOT NULL,
  `nomor_gigi` varchar(2) NOT NULL,
  `posisi_gigi` enum('M','D','O','B','L','P','R') NOT NULL,
  `kondisi_gigi` varchar(50) NOT NULL,
  `warna_odontogram` varchar(7) DEFAULT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pasien`,`nomor_gigi`,`posisi_gigi`,`tanggal_periksa`)
) ENGINE=MyISAM;

/*Data for the table `odontogram_pasien` */

insert  into `odontogram_pasien`(`id_pasien`,`tanggal_periksa`,`nomor_gigi`,`posisi_gigi`,`kondisi_gigi`,`warna_odontogram`,`keterangan`,`created_at`,`updated_at`) values 
(1,'2025-03-08 16:04:32','18','M','Karies','#FF0000','Segera pasang','2025-03-08 16:04:33','2025-03-08 16:04:33');

/*Table structure for table `pasien` */

DROP TABLE IF EXISTS `pasien`;

CREATE TABLE `pasien` (
  `id_pasien` int NOT NULL AUTO_INCREMENT,
  `id_klinik` int NOT NULL,
  `no_rekam_medis` varchar(50) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `golongan_darah` enum('A','B','AB','O') DEFAULT NULL,
  `kontak_darurat_nama` varchar(100) DEFAULT NULL,
  `kontak_darurat_telepon` varchar(20) DEFAULT NULL,
  `kontak_darurat_relasi` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pasien`),
  KEY `id_klinik` (`id_klinik`)
) ENGINE=MyISAM AUTO_INCREMENT=2;

/*Data for the table `pasien` */

insert  into `pasien`(`id_pasien`,`id_klinik`,`no_rekam_medis`,`nama_lengkap`,`nik`,`tempat_lahir`,`tanggal_lahir`,`jenis_kelamin`,`alamat`,`telepon`,`email`,`golongan_darah`,`kontak_darurat_nama`,`kontak_darurat_telepon`,`kontak_darurat_relasi`,`created_at`,`updated_at`) values 
(1,2,'CIB00001','Andrew Brian Osmond','3273101122330001','Kebumen','1986-10-11','L','Bandung','087838595695','abosmond2@gmail.com',NULL,'-','-','-','2025-02-27 13:48:46','2025-02-27 13:49:52');

/*Table structure for table `rekam_medis_pasien` */

DROP TABLE IF EXISTS `rekam_medis_pasien`;

CREATE TABLE `rekam_medis_pasien` (
  `id_rekam_medis` int NOT NULL AUTO_INCREMENT,
  `id_pasien` int NOT NULL,
  `id_dokter_klinik` int NOT NULL,
  `tanggal_kunjungan` datetime NOT NULL,
  `keluhan` text,
  `catatan_dokter` text,
  `biaya` decimal(10,2) DEFAULT NULL,
  `status_pembayaran` enum('Belum Bayar','Sudah Bayar') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rekam_medis`),
  KEY `id_pasien` (`id_pasien`),
  KEY `id_dokter_klinik` (`id_dokter_klinik`)
) ENGINE=InnoDB AUTO_INCREMENT=4;

/*Data for the table `rekam_medis_pasien` */

insert  into `rekam_medis_pasien`(`id_rekam_medis`,`id_pasien`,`id_dokter_klinik`,`tanggal_kunjungan`,`keluhan`,`catatan_dokter`,`biaya`,`status_pembayaran`,`created_at`,`updated_at`) values 
(3,1,1,'2025-03-08 16:04:32','Giginya maju','Pasang behel',3510000.00,'Sudah Bayar','2025-03-08 16:04:33','2025-03-11 07:58:33');

/*Table structure for table `rekam_medis_tindakan` */

DROP TABLE IF EXISTS `rekam_medis_tindakan`;

CREATE TABLE `rekam_medis_tindakan` (
  `id_rekam_medis` int NOT NULL,
  `id_master_kode_penyakit` int NOT NULL,
  `id_master_tindakan` int NOT NULL,
  `nomor_gigi` varchar(2) NOT NULL,
  `posisi_gigi` enum('M','D','O','B','L','P','R') NOT NULL,
  `catatan_tindakan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rekam_medis`,`id_master_kode_penyakit`,`nomor_gigi`,`posisi_gigi`),
  KEY `id_master_kode_penyakit` (`id_master_kode_penyakit`),
  KEY `id_master_tindakan` (`id_master_tindakan`)
) ENGINE=MyISAM;

/*Data for the table `rekam_medis_tindakan` */

insert  into `rekam_medis_tindakan`(`id_rekam_medis`,`id_master_kode_penyakit`,`id_master_tindakan`,`nomor_gigi`,`posisi_gigi`,`catatan_tindakan`,`created_at`,`updated_at`) values 
(3,58,1,'18','M','Segera pasang','2025-03-08 16:04:33','2025-03-08 16:04:33');

/*Table structure for table `resep_tindakan` */

DROP TABLE IF EXISTS `resep_tindakan`;

CREATE TABLE `resep_tindakan` (
  `id_resep_tindakan` int NOT NULL,
  `id_rekam_medis` int NOT NULL,
  `id_obat` int NOT NULL,
  `jumlah` int NOT NULL,
  `aturan_pakai` varchar(100) NOT NULL,
  `catatan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_resep_tindakan`,`id_rekam_medis`,`id_obat`),
  KEY `id_rekam_medis` (`id_rekam_medis`),
  KEY `id_obat` (`id_obat`)
) ENGINE=MyISAM;

/*Data for the table `resep_tindakan` */

insert  into `resep_tindakan`(`id_resep_tindakan`,`id_rekam_medis`,`id_obat`,`jumlah`,`aturan_pakai`,`catatan`,`created_at`,`updated_at`) values 
(1,3,1,1,'3 x 1 setelah makan','Harus dihabiskan','2025-03-08 16:04:33','2025-03-08 16:04:33');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM;

/*Data for the table `sessions` */

insert  into `sessions`(`id`,`user_id`,`ip_address`,`user_agent`,`payload`,`last_activity`) values 
('2YWZ0f6eU2HpQleQR7UrAeUnY2e9RhXzOArwYh0f',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkU4ZGpqS0puZ3RYcWw0MU9lQ3BKeVZkNE5naHVYeXJpQ25Pd1VteSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1739943983);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id_users` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `passwords` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_users`)
) ENGINE=MyISAM AUTO_INCREMENT=2;

/*Data for the table `users` */

insert  into `users`(`id_users`,`username`,`passwords`,`nama_lengkap`,`created_at`,`updated_at`) values 
(1,'marlin','$2y$10$Nr.mLJFmFFp4vV4k/1ljF.58pqpcvxovecs.KmGwI0tgbHe5yMGii','Marlin Himawati','2025-02-18 10:37:53','2025-02-18 10:37:53');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
