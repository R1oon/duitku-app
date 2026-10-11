<div align="center">

# 📓 DUITKU — Black Journal Edition

**Jurnal pengeluaran harian keluarga dengan dashboard sinkronisasi Realtime, analitik bulanan, ekspor laporan PDF A4 formal, dan dukungan PWA.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-14B8A6?style=for-the-badge)](https://duitku-app-orpin.vercel.app/)

[🌐 **Live Demo**](https://duitku-app-orpin.vercel.app/) • [✍️ **Halaman Editor (`/editor`)**](https://duitku-app-orpin.vercel.app/editor) • [👁️ **Realtime Viewer (`/ari`)**](https://duitku-app-orpin.vercel.app/ari) • [📐 **Project Blueprint**](./docs/blueprint.md)

</div>

---

## ✨ Tentang DUITKU

**DUITKU** dirancang untuk mengubah pelaporan pengeluaran harian yang manual menjadi sistem **Single-Input Realtime Sharing**. Cukup catat sekali di halaman Editor, dan seluruh dashboard Viewer (orang tua/wali) akan diperbarui secara instan tanpa perlu me-refresh halaman.

### Prinsip Utama
1. **⚡ Zero Friction** — Tanpa login, tanpa registrasi, tanpa OTP/PIN yang menghambat pencatatan cepat.
2. **📱 Mobile-First** — Didesain presisi untuk layar ponsel (`390px–430px`) lengkap dengan dukungan *Progressive Web App (PWA)* yang dapat di-install ke layar utama (*Add to Home Screen*).
3. **🔴 Realtime Transparency** — Menggunakan *Supabase Realtime Postgres Changes* untuk menyinkronkan aksi `INSERT`, `UPDATE`, dan `DELETE` secara langsung.
4. **🖤 Black Journal Design System** — Perpaduan tema gelap *matte black* (`#0D0D0D`) bernuansa jurnal minimalis dengan tipografi **Inter** dan **Roboto Mono** khusus untuk nominal uang serta waktu transaksi.

---

## 🚀 Fitur Utama

### 1. ✍️ Editor Jurnal (`/editor`)
- **Optimistic UI (0ms Latency)**: Saat transaksi disimpan, diubah, atau dihapus, antarmuka langsung diperbarui seketika tanpa menunggu jeda jaringan (*network latency*), lengkap dengan proteksi *auto-rollback* jika koneksi gagal.
- **Live Rupiah Formatter**: Pratinjau nominal otomatis dalam format Rupiah (`Rp10.000`) saat mengetik angka.
- **Indikator Status Database**: Penanda koneksi aktif (`● Connected`) ke Supabase.

### 2. 👁️ Dashboard Realtime Viewer (`/ari`)
- **Live Stream Timeline**: Menampilkan transaksi hari ini dari yang terbaru hingga terlama dengan *badge* animasi **"Baru"** saat data masuk secara *live*.
- **Big Total Display**: Fokus utama pada metrik total pengeluaran hari ini dengan tipografi besar yang mudah dibaca.
- **Read-Only Protection**: Halaman khusus pemantau tanpa tombol edit/hapus untuk mencegah perubahan data yang tidak disengaja.

### 3. 📊 Rekapitulasi & Analitik Bulanan
- **Navigasi Antar Bulan**: Pantau riwayat pengeluaran bulan berjalan maupun bulan-bulan sebelumnya.
- **Auto-Categorization Engine**: Pengelompokan kategori otomatis berbasis kata kunci (*Makanan, Minuman, Transport, Belanja, Lainnya*) tanpa membebani pengguna saat input.
- **Visualisasi Donut Chart**: Grafik distribusi pengeluaran interaktif menggunakan `Recharts`.

### 4. 📄 Ekspor Laporan PDF Standar Kantor (A4 Portrait)
- Menghasilkan dokumen laporan keuangan formal berlatar putih bersih (`#FFFFFF`) dan teks hitam (`#000000`) yang siap cetak dan hemat tinta.
- Dilengkapi kop laporan, kotak ringkasan eksekutif, tabel rincian bernomor dengan penjumlahan total keseluruhan, serta kolom tanda tangan formal (*Mengetahui* & *Pembuat Laporan*).

---

## 🛠️ Tech Stack

| Layer | Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Routing modern, Server/Client Components, PWA Manifest |
| **Language** | TypeScript 5 | Type-safety menyeluruh untuk skema database & komponen |
| **Styling** | Tailwind CSS v4 | Styling *utility-first* dengan tema kustom *Black Journal* |
| **Database** | Supabase PostgreSQL | Penyimpanan data transaksi awan |
| **Realtime** | Supabase Realtime | Sinkronisasi *live* via WebSockets (`postgres_changes`) |
| **Charts** | Recharts | Visualisasi grafik analitik kategori pengeluaran |
| **PDF Generator** | jsPDF + html2canvas | Ekspor dokumen laporan keuangan A4 siap cetak |
| **Icons** | Lucide React | Ikonografi minimalis & konsisten |

---

## 📂 Struktur Folder

```text
duitku-app/
├── docs/
│   └── blueprint.md               # Dokumen PRD & Master Project Blueprint
├── public/
│   ├── icons/                     # Ikon aplikasi PWA (192x192, 512x512, Apple Touch Icon, SVG)
│   └── manifest.json              # File konfigurasi PWA standalone
└── src/
    ├── app/
    │   ├── ari/
    │   │   └── page.tsx           # Halaman Dashboard Realtime Viewer & Analitik Bulanan
    │   ├── editor/
    │   │   └── page.tsx           # Halaman Editor Jurnal (Input/Edit/Hapus + Optimistic UI)
    │   ├── globals.css            # Konfigurasi tema Black Journal & Tailwind CSS v4
    │   ├── layout.tsx             # Root Layout, konfigurasi Font (Inter & Roboto Mono) & Viewport
    │   ├── manifest.ts            # Generator Web App Manifest untuk PWA
    │   └── page.tsx               # Halaman Gerbang Utama (Gateway Editor / Viewer)
    ├── components/
    │   ├── editor/                # Komponen halaman Editor (Header, SummaryCard, Modal, dll.)
    │   ├── viewer/                # Komponen halaman Viewer (BigTotal, Timeline, Recharts, Tabel)
    │   └── pdf/                   # Template cetak laporan formal A4 & Modal progres PDF
    └── lib/
        ├── categories.ts          # Klasifikasi kategori otomatis berbasis kata kunci
        ├── format.ts              # Formatter Rupiah (Rp10.000), Jam (12:41), dan Tanggal Indonesia
        ├── pdf.ts                 # Engine generator PDF A4 Portrait (jsPDF + html2canvas)
        ├── realtime.ts            # Helper subscription channel Supabase Realtime
        ├── supabase.ts            # Inisialisasi client Supabase & tipe skema TypeScript
        ├── transactions.ts        # CRUD Helper (Select, Insert, Update, Delete)
        └── utils.ts               # Utility penggabung class Tailwind (clsx + tailwind-merge)
```

---

## ⚙️ Panduan Instalasi & Penggunaan Lokal

### 1. Clone Repositori & Instal Dependensi

```bash
git clone https://github.com/R1oon/duitku-app.git
cd duitku-app
npm install
```

### 2. Konfigurasi Database Supabase

Buat project baru di [Supabase](https://supabase.com/), lalu jalankan query SQL berikut pada menu **SQL Editor**:

```sql
-- 1. Buat tabel utama transactions
create table public.transactions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    item_name text not null,
    amount integer not null check (amount > 0),
    note text
);

-- 2. Aktifkan fitur Realtime pada tabel transactions
alter publication supabase_realtime add table transactions;

-- 3. Aktifkan Row Level Security (RLS) untuk akses MVP
alter table transactions enable row level security;

create policy "public_read" on transactions for select using (true);
create policy "public_insert" on transactions for insert with check (true);
create policy "public_update" on transactions for update using (true);
create policy "public_delete" on transactions for delete using (true);
```

### 3. Atur Environment Variables

Salin file `.env.local.example` menjadi `.env.local`, lalu masukkan **Project URL** dan **Anon Key** dari dashboard Supabase Anda:

```bash
cp .env.local.example .env.local
```

Isi file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://project-ref-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-supabase-anda
```

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda:
- Gunakan [http://localhost:3000/editor](http://localhost:3000/editor) untuk mencatat transaksi.
- Buka tab baru di [http://localhost:3000/ari](http://localhost:3000/ari) untuk melihat pembaruan *realtime* bekerja secara langsung.

---

<div align="center">
  <sub>Dibangun dengan ❤️ menggunakan Next.js, Tailwind CSS, dan Supabase.</sub>
</div>
