# 📋 TaskTracker

Aplikasi manajemen tugas berbasis web yang dibangun dengan **Next.js**, **Drizzle ORM**, dan **MySQL**. Mendukung mode tamu (data tersimpan di browser) dan mode pengguna terautentikasi (data tersimpan di database).

---

## ✨ Fitur

- **Autentikasi** — Register & Login dengan JWT yang disimpan di cookie HttpOnly
- **Mode Tamu** — Bisa membuat task tanpa login; data disimpan di `localStorage`
- **CRUD Task** — Tambah, edit, hapus task dengan status: *Belum*, *Proses*, *Selesai*
- **Draft Otomatis** — Data yang sedang diketik di form disimpan otomatis; tidak hilang saat refresh
- **Responsif** — Tampilan menyesuaikan layar desktop dan mobile

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| ORM | Drizzle ORM |
| Database | MySQL |
| Auth | JWT + bcryptjs |
| Validasi | Zod + React Hook Form |

---

## 📦 Persyaratan

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MySQL** ≥ 8.0 (berjalan secara lokal atau remote)

---

## 🚀 Instalasi

### 1. Clone repositori

```bash
git clone https://github.com/username/tasktracker.git
cd tasktracker
```

### 2. Install dependensi

```bash
npm install
```

### 3. Buat file environment

Buat file `.env.local` di root proyek:

```bash
cp .env.local.example .env.local   # jika tersedia
# atau buat manual:
touch .env.local
```

Isi `.env.local` dengan variabel berikut:

```env
# Koneksi ke database MySQL
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# Secret untuk JWT (ganti dengan string acak yang kuat)
JWT_SECRET="ganti_dengan_string_rahasia_yang_panjang_dan_acak"
```

**Contoh:**

```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/tasktracker_db"
JWT_SECRET="s3cr3t_k3y_yang_sangat_panjang_dan_aman_2024!"
```

> ⚠️ **Penting:** Jangan pernah commit file `.env.local` ke repositori. File ini sudah ada di `.gitignore`.

---

## 🗄️ Konfigurasi Database

### 1. Buat database MySQL

Masuk ke MySQL CLI atau tools seperti **TablePlus** / **phpMyAdmin**, lalu jalankan:

```sql
CREATE DATABASE tasktracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Jalankan migrasi schema

Perintah berikut akan membaca `db/schema.ts` dan membuat tabel `users` dan `tasks` secara otomatis:

```bash
npx drizzle-kit push
```

> Drizzle akan membandingkan schema kode dengan database dan mengaplikasikan perubahan yang diperlukan.

**Struktur tabel yang akan dibuat:**

```
users
├── id          INT AUTO_INCREMENT PRIMARY KEY
├── name        VARCHAR(255) NOT NULL
├── email       VARCHAR(255) NOT NULL UNIQUE
└── password    VARCHAR(255) NOT NULL  ← bcrypt hash

tasks
├── id          INT AUTO_INCREMENT PRIMARY KEY
├── user_id     INT NOT NULL  → FK ke users.id
├── judul       VARCHAR(255) NOT NULL
├── description TEXT
├── status      ENUM('Belum','Proses','Selesai') DEFAULT 'Belum'
└── created_at  TIMESTAMP DEFAULT NOW()
```

### (Opsional) Generate migrasi SQL

Jika ingin melihat SQL migrasi secara eksplisit sebelum diaplikasikan:

```bash
npx drizzle-kit generate
```

File SQL migrasi akan tersimpan di folder `./database/`.

### (Opsional) Import data dummy untuk pengembangan

Tersedia file SQL export dengan data contoh di `database/expoxt_database.sql`. File ini berisi:
- **5 user** siap pakai (semua berpassword `password123`)
- **50 task** dengan berbagai status tersebar ke tiap user

Import ke MySQL:

```bash
mysql -u root -p tasktracker_db < database/expoxt_database.sql
```

Atau via MySQL CLI:

```sql
USE tasktracker_db;
SOURCE /path/ke/project/database/expoxt_database.sql;
```

**Akun demo yang tersedia:**

| Nama | Email | Password |
|---|---|---|
| Budi Santoso | budi@email.com | password123 |
| Siti Rahayu | siti@email.com | password123 |
| Andi Wijaya | andi@email.com | password123 |
| Dewi Kusuma | dewi@email.com | password123 |
| Rizky Pratama | rizky@email.com | password123 |

---

## ▶️ Menjalankan Aplikasi

### Mode Development

```bash
npm run dev
```

Aplikasi berjalan di: [http://localhost:3000](http://localhost:3000)

### Mode Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 📁 Struktur Proyek

```
tasktracker/
├── actions/            # Server Actions (auth, task CRUD)
├── app/                # Next.js App Router (pages & layouts)
├── components/
│   ├── auth/           # Form Login & Register
│   ├── layout/         # Navbar
│   ├── task/           # TaskBoard, TaskForm, modal Add & Edit
│   └── ui/             # Komponen shadcn/ui (Button, Input, dll.)
├── db/
│   ├── schema.ts       # Definisi tabel Drizzle ORM
│   └── index.ts        # Koneksi database
├── lib/
│   ├── session.ts      # Manajemen sesi JWT
│   └── validations/    # Schema validasi Zod
├── database/           # Output migrasi SQL Drizzle
├── drizzle.config.ts   # Konfigurasi Drizzle ORM
└── .env.local          # Variabel environment (tidak di-commit)
```

---

## 🔐 Alur Autentikasi

1. **Register** — Password di-hash dengan `bcryptjs` sebelum disimpan
2. **Login** — Verifikasi password hash → buat JWT token → simpan di cookie `auth_token` (HttpOnly)
3. **Session** — Setiap request server membaca cookie dan memverifikasi JWT
4. **Logout** — Cookie `auth_token` dihapus

---

## 💾 Draft Form Otomatis

Data yang diketik di modal **Add Task** maupun **Edit Task** disimpan otomatis ke `localStorage` browser. Jika halaman di-refresh sebelum submit, data akan muncul kembali saat modal dibuka.

- Draft dihapus otomatis setelah form berhasil di-submit
- Klik tombol **"Hapus Draft"** di footer modal untuk menghapus secara manual

---