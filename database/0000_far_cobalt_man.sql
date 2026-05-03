CREATE TABLE `tasks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`judul` varchar(255) NOT NULL,
	`description` text,
	`status` enum('Belum','Proses','Selesai') NOT NULL DEFAULT 'Belum',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

--> Password semua user adalah password123
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Budi Santoso',  'budi@email.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Siti Rahayu',   'siti@email.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Andi Wijaya',   'andi@email.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Dewi Kusuma',   'dewi@email.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Rizky Pratama', 'rizky@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO `tasks` (`user_id`, `judul`, `description`, `status`, `created_at`) VALUES
(1, 'Setup project Next.js',       '<p>Inisialisasi project dengan <strong>create-next-app</strong> dan konfigurasi ESLint.</p>',          'Selesai', '2024-01-01 08:00:00'),
(1, 'Desain database schema',      '<p>Buat ERD untuk tabel <strong>users</strong> dan <strong>tasks</strong>.</p>',                       'Selesai', '2024-01-02 09:00:00'),
(1, 'Integrasi Drizzle ORM',       '<p>Install drizzle-orm dan konfigurasi koneksi ke <strong>MySQL</strong>.</p>',                        'Selesai', '2024-01-03 10:00:00'),
(1, 'Buat endpoint CRUD task',     '<p>Implementasi <strong>Server Actions</strong> untuk create, read, update, delete task.</p>',          'Proses',  '2024-01-04 11:00:00'),
(1, 'Integrasi Quill JS',          '<p>Tambahkan rich text editor dengan fitur <em>bold, italic, list</em>.</p>',                          'Proses',  '2024-01-05 12:00:00'),
(1, 'Implementasi auto-save',      '<p>Simpan draft ke <strong>localStorage</strong> setiap pengguna mengetik.</p>',                       'Belum',   '2024-01-06 13:00:00'),
(1, 'Setup autentikasi JWT',       '<p>Gunakan library <strong>jose</strong> untuk sign dan verify token JWT.</p>',                        'Belum',   '2024-01-07 14:00:00'),
(1, 'Buat halaman login',          '<p>Form login dengan validasi email dan password.</p>',                                                'Belum',   '2024-01-08 15:00:00'),
(1, 'Deploy ke Vercel',            '<p>Konfigurasi environment variable dan deploy aplikasi.</p>',                                         'Belum',   '2024-01-09 16:00:00'),
(1, 'Tulis README.md',             '<p>Dokumentasi instalasi dan cara menjalankan aplikasi.</p>',                                          'Belum',   '2024-01-10 17:00:00'),

(2, 'Riset UI/UX dashboard',       '<p>Kumpulkan referensi desain dari <strong>Dribbble</strong> dan Figma community.</p>',                'Selesai', '2024-01-01 08:30:00'),
(2, 'Buat komponen Navbar',        '<p>Navbar responsif dengan <strong>Tailwind CSS</strong> dan hamburger menu mobile.</p>',              'Selesai', '2024-01-02 09:30:00'),
(2, 'Halaman daftar task',         '<p>Tampilkan semua task dalam bentuk <em>card grid</em> dengan filter status.</p>',                    'Selesai', '2024-01-03 10:30:00'),
(2, 'Filter dan sorting task',     '<p>Dropdown filter berdasarkan <strong>status</strong> dan sort by tanggal.</p>',                      'Proses',  '2024-01-04 11:30:00'),
(2, 'Dark mode toggle',            '<p>Implementasi dark mode menggunakan <strong>next-themes</strong>.</p>',                              'Proses',  '2024-01-05 12:30:00'),
(2, 'Komponen modal konfirmasi',   '<p>Modal dialog konfirmasi sebelum hapus task.</p>',                                                   'Belum',   '2024-01-06 13:30:00'),
(2, 'Loading skeleton UI',         '<p>Skeleton loader saat data task sedang di-fetch dari server.</p>',                                   'Belum',   '2024-01-07 14:30:00'),
(2, 'Toast notifikasi',            '<p>Gunakan <strong>react-hot-toast</strong> untuk notifikasi sukses dan error.</p>',                   'Belum',   '2024-01-08 15:30:00'),
(2, 'Responsif mobile view',       '<p>Pastikan semua halaman tampil baik di layar <strong>375px</strong> ke atas.</p>',                   'Belum',   '2024-01-09 16:30:00'),
(2, 'Testing UI komponen',         '<p>Unit test komponen menggunakan <strong>React Testing Library</strong>.</p>',                        'Belum',   '2024-01-10 17:30:00'),

(3, 'Setup environment variable',  '<p>Konfigurasi <strong>.env.local</strong> untuk DATABASE_URL dan JWT_SECRET.</p>',                   'Selesai', '2024-01-01 09:00:00'),
(3, 'Middleware auth protection',  '<p>Proteksi route <em>/dashboard</em> dari user yang belum login.</p>',                               'Selesai', '2024-01-02 10:00:00'),
(3, 'Hash password bcrypt',        '<p>Gunakan <strong>bcryptjs</strong> dengan salt rounds 10.</p>',                                     'Selesai', '2024-01-03 11:00:00'),
(3, 'Endpoint register user',      '<p>Validasi email unik dan simpan user baru dengan password ter-hash.</p>',                           'Proses',  '2024-01-04 12:00:00'),
(3, 'Endpoint login user',         '<p>Verifikasi password dengan <strong>bcrypt.compare</strong> lalu return JWT.</p>',                  'Proses',  '2024-01-05 13:00:00'),
(3, 'Simpan token di cookie',      '<p>Set <strong>httpOnly cookie</strong> agar token tidak bisa diakses via JavaScript.</p>',           'Belum',   '2024-01-06 14:00:00'),
(3, 'Refresh token mechanism',     '<p>Refresh token dengan expiry 30 hari untuk login persisten.</p>',                                   'Belum',   '2024-01-07 15:00:00'),
(3, 'Rate limiting login',         '<p>Batasi percobaan login maksimal <strong>5 kali</strong> per IP per menit.</p>',                    'Belum',   '2024-01-08 16:00:00'),
(3, 'Logout dan clear cookie',     '<p>Endpoint logout yang menghapus cookie dan redirect ke login.</p>',                                 'Belum',   '2024-01-09 17:00:00'),
(3, 'Audit log aktivitas user',    '<p>Catat setiap login dan perubahan task ke tabel <em>audit_logs</em>.</p>',                          'Belum',   '2024-01-10 18:00:00'),

(4, 'Analisis kebutuhan fitur',    '<p>Diskusi tim untuk menentukan <strong>MVP</strong> fitur task tracker.</p>',                        'Selesai', '2024-01-01 07:00:00'),
(4, 'Buat wireframe Figma',        '<p>Wireframe low-fidelity untuk halaman <em>login, dashboard, form task</em>.</p>',                   'Selesai', '2024-01-02 08:00:00'),
(4, 'Setup Tailwind CSS',          '<p>Konfigurasi Tailwind dengan custom color palette sesuai brand.</p>',                               'Selesai', '2024-01-03 09:00:00'),
(4, 'Komponen form tambah task',   '<p>Form dengan validasi client-side, judul wajib diisi.</p>',                                         'Proses',  '2024-01-04 10:00:00'),
(4, 'Komponen edit task',          '<p>Pre-fill form edit dengan data task existing termasuk konten <em>Quill</em>.</p>',                  'Proses',  '2024-01-05 11:00:00'),
(4, 'Hapus task konfirmasi',       '<p>Dialog konfirmasi sebelum eksekusi delete.</p>',                                                   'Belum',   '2024-01-06 12:00:00'),
(4, 'Update status task',          '<p>Toggle status langsung dari daftar tanpa masuk halaman edit.</p>',                                 'Belum',   '2024-01-07 13:00:00'),
(4, 'Pagination daftar task',      '<p>Pagination <strong>10 task per halaman</strong> untuk performa lebih baik.</p>',                   'Belum',   '2024-01-08 14:00:00'),
(4, 'Search task by judul',        '<p>Search bar dengan <em>debounce 300ms</em> untuk filter task.</p>',                                 'Belum',   '2024-01-09 15:00:00'),
(4, 'Export task ke CSV',          '<p>Fitur export semua task milik user ke format <strong>CSV</strong>.</p>',                           'Belum',   '2024-01-10 16:00:00'),

(5, 'Setup CI/CD pipeline',        '<p>GitHub Actions untuk auto deploy ke Vercel setiap push ke main.</p>',                             'Selesai', '2024-01-01 08:00:00'),
(5, 'Konfigurasi ESLint',          '<p>Setup ESLint dengan rules <em>typescript-eslint</em> dan prettier.</p>',                          'Selesai', '2024-01-02 09:00:00'),
(5, 'Optimasi query database',     '<p>Index pada kolom <strong>user_id</strong> dan <strong>status</strong>.</p>',                      'Selesai', '2024-01-03 10:00:00'),
(5, 'Error handling global',       '<p>Error boundary React dan handler untuk <em>unhandled promise rejection</em>.</p>',                'Proses',  '2024-01-04 11:00:00'),
(5, 'Validasi input Zod',          '<p>Gunakan <strong>Zod</strong> untuk validasi semua input sebelum masuk database.</p>',             'Proses',  '2024-01-05 12:00:00'),
(5, 'Sanitasi HTML Quill',         '<p>Pakai <strong>isomorphic-dompurify</strong> untuk sanitasi output Quill.</p>',                    'Belum',   '2024-01-06 13:00:00'),
(5, 'Caching dengan Redis',        '<p>Cache daftar task per user di <strong>Redis</strong> dengan TTL 5 menit.</p>',                    'Belum',   '2024-01-07 14:00:00'),
(5, 'Unit test Server Actions',    '<p>Test semua server actions menggunakan <strong>Vitest</strong>.</p>',                              'Belum',   '2024-01-08 15:00:00'),
(5, 'Monitoring dengan Sentry',    '<p>Integrasi <strong>Sentry</strong> untuk error tracking di production.</p>',                       'Belum',   '2024-01-09 16:00:00'),
(5, 'Load testing aplikasi',       '<p>Simulasi 100 concurrent user menggunakan <strong>k6</strong>.</p>',                               'Belum',   '2024-01-10 17:00:00');