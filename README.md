<div align="center">

# 📓 DUITKU — Black Journal Edition

**Jurnal pengeluaran harian keluarga dengan dashboard sinkronisasi Realtime, analitik bulanan interaktif, ekspor laporan PDF A4 formal dinamis, dan dukungan PWA.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-14B8A6?style=for-the-badge)](https://duitku-app-orpin.vercel.app/)
[![Supabase Keep-Alive](https://img.shields.io/badge/Keep--Alive-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/R1oon/duitku-app/actions/workflows/supabase-keepalive.yml)

[🌐 **Live Demo**](https://duitku-app-orpin.vercel.app/) • [✍️ **Halaman Editor (`/editor`)**](https://duitku-app-orpin.vercel.app/editor) • [👁️ **Realtime Viewer (`/ari`)**](https://duitku-app-orpin.vercel.app/ari) • [📐 **Project Blueprint**](./docs/blueprint.md)

</div>

---

## ✨ Tentang DUITKU

**DUITKU** dirancang untuk mentransformasi pelaporan keuangan harian yang manual menjadi sistem **Single-Input Realtime Sharing**. Pengguna cukup mencatat sekali di halaman Editor, dan seluruh dashboard Viewer (orang tua/wali) akan diperbarui secara instan tanpa perlu memuat ulang halaman.

### Prinsip Utama
1. **⚡ Zero Friction** — Tanpa login, registrasi, maupun OTP/PIN yang menghambat pencatatan kilat.
2. **📱 Mobile-First Ergonomics** — Didesain presisi untuk layar ponsel (`390px–430px`) dengan *bottom sheet drawer*, *quick nominal chips*, dan dukungan *Progressive Web App (PWA)* yang dapat diinstal ke layar utama (*Add to Home Screen*).
3. **🔴 Realtime Transparency** — Menggunakan *Supabase Realtime Postgres Changes* untuk menyinkronkan aksi `INSERT`, `UPDATE`, dan `DELETE` secara live dengan proteksi pemulihan koneksi otomatis.
4. **🖤 Black Journal Design System** — Perpaduan tema gelap *matte black* (`#0D0D0D`) bernuansa jurnal minimalis dengan tipografi **Inter** dan **Roboto Mono** khusus untuk nominal uang serta waktu transaksi.

---

## 🚀 Fitur Utama

### 1. ✍️ Editor Jurnal Cepat (`/editor`)
- **Optimistic UI (0ms Latency)**: Antarmuka langsung terupdate seketika saat menyimpan, mengedit, atau menghapus transaksi tanpa menunggu jeda jaringan, dilengkapi proteksi *auto-rollback* jika koneksi terputus.
- **Quick Nominal Chips**: Tombol nominal cepat (`+10rb`, `+20rb`, `+50rb`, `+100rb`, dan `Reset`) untuk mempercepat input transaksi harian hanya dengan sekali sentuh.
- **Live Category Detection**: Tag kategori otomatis terdeteksi dan muncul sebagai *badge* pratinjau langsung saat mengetik nama barang (misal: "Kopi Susu" ➔ badge Minuman).
- **Mobile Keyboard Ergonomics**: Mode input angka numerik native (`inputMode="numeric"`) dengan pemisah ribuan otomatis saat mengetik.
- **Indikator Database & Auto-Reconnect**: Status koneksi aktif (`● Connected`) ke Supabase dengan tombol aksi *retry* instan jika terjadi gangguan jaringan.

### 2. 👁️ Dashboard Realtime Viewer (`/ari`)
- **Live Stream Timeline**: Menampilkan transaksi hari ini secara kronologis dengan *badge* animasi **"Baru"** saat data masuk secara langsung.
- **Filter Kategori & Pencarian Instan**: Tab chip filter kategori (*Semua, Makanan, Minuman, Transport, Belanja, Lainnya*) serta kotak pencarian cepat untuk memfilter transaksi tanpa reload.
- **Big Total Display**: Metrik utama total pengeluaran hari ini disajikan dengan tipografi besar yang kontras dan nyaman dipandang.
- **Read-Only Protection**: Halaman khusus pemantau tanpa kontrol pengeditan/penghapusan untuk menjaga integritas data.

### 3. 📊 Rekapitulasi & Analitik Bulanan
- **Center Info Hub Donut Chart**: Visualisasi distribusi pengeluaran berbasis `Recharts` dengan titik informasi interaktif di pusat diagram (menampilkan total keseluruhan secara default, serta nominal, persentase kontribusi, dan jumlah transaksi saat kategori disentuh atau diarahkan kursor).
- **Auto-Categorization Engine**: Pengelompokan cerdas berbasis kata kunci tanpa membebani pengguna saat input.
- **Navigasi Antar Bulan**: Kemudahan menelusuri riwayat pengeluaran bulan berjalan maupun bulan-bulan terdahulu.

### 4. 📄 Ekspor Dokumen Laporan Keuangan Formal (A4 Portrait)
- **Smart Dynamic Multi-Page Engine**: Algoritma paginasi cerdas yang memecah puluhan baris transaksi ke dalam beberapa lembar A4 secara rapi tanpa terpotong (*no cutoff*).
- **Proporsi Pengeluaran Kategori**: *Segmented horizontal progress bar* dengan kode warna representatif, persentase, dan nominal masing-masing kategori.
- **Executive KPI Cards**: 3 kartu ringkasan eksekutif (*Total Pengeluaran Bulanan, Aktivitas Transaksi & Rata-rata Harian, dan Kategori Dominan*).
- **Tabel Presisi & Anti Baseline-Sinking**: Tata letak tabel dengan *font metrics* simetris (`Arial`), nomor urut berlanjut antar halaman, penanda bersambung, banner total keseluruhan, serta dua kolom tanda tangan formal (*Orang Tua* & *Pembuat Laporan*).

### 5. 🛡️ Supabase Keep-Alive Automation
- **Scheduled GitHub Actions Cron**: Workflow otomatis (`.github/workflows/supabase-keepalive.yml`) yang berjalan dua kali seminggu (Senin & Kamis pukul 06.00 UTC / 13.00 WIB) untuk melakukan REST query baca ringan.
- **Pencegah Auto-Pause 7 Hari**: Menjaga project Supabase Free Tier selalu aktif tanpa perlu memasukkan data transaksi palsu dan 100% aman sesuai ketentuan layanan Supabase.

---

## 🛠️ Tech Stack

| Layer | Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Routing modern, Server/Client Components, PWA Manifest |
| **Language** | TypeScript 5 | Strict type-safety menyeluruh untuk skema data & komponen |
| **Styling** | Tailwind CSS v4 | Utility-first styling dengan custom theme *Black Journal* |
| **Database** | Supabase PostgreSQL | Penyimpanan transaksi awan dengan Row Level Security |
| **Realtime** | Supabase Realtime | Sinkronisasi data dua arah via WebSocket (`postgres_changes`) |
| **Data Viz** | Recharts | Donut chart interaktif dengan Center Info Hub |
| **PDF Engine** | jsPDF + html2canvas | Pembuat dokumen laporan A4 multi-halaman siap cetak |
| **Automation** | GitHub Actions | Scheduled keep-alive cron untuk project Supabase |
| **Icons** | Lucide React | Ikonografi modern, ringan, dan konsisten |

---

## 📂 Struktur Direktori Kode

Struktur proyek dirancang modular mengikuti pola *Domain-Driven UI* untuk memisahkan logika editor, viewer, dan pelaporan PDF:

```text
duitku-app/
├── .github/
│   └── workflows/
│       └── supabase-keepalive.yml     # Workflow cron keep-alive Supabase Free Tier
├── docs/
│   └── blueprint.md                   # Dokumen PRD & Master Project Blueprint
├── public/
│   ├── icons/                         # Aset ikon PWA (192px, 512px, Apple Touch Icon, SVG)
│   └── manifest.json                  # Manifest konfigurasi PWA standalone
└── src/
    ├── app/
    │   ├── ari/
    │   │   └── page.tsx               # Dashboard Realtime Viewer & Analitik Bulanan
    │   ├── editor/
    │   │   └── page.tsx               # Editor Jurnal (Input/Edit/Hapus + Optimistic UI)
    │   ├── globals.css                # Styling global tema Black Journal & Tailwind CSS v4
    │   ├── layout.tsx                 # Root layout, konfigurasi font & metadata viewport
    │   ├── manifest.ts                # Generator Web App Manifest dinamis untuk PWA
    │   └── page.tsx                   # Halaman gerbang utama (Gateway Editor / Viewer)
    ├── components/
    │   ├── editor/                    # Komponen antarmuka pencatatan
    │   │   ├── DeleteConfirmModal.tsx # Dialog konfirmasi penghapusan transaksi
    │   │   ├── FloatingAddButton.tsx  # Tombol aksi melayang (FAB) tambah transaksi
    │   │   ├── Header.tsx             # Header editor dengan indikator status koneksi
    │   │   ├── SummaryCard.tsx        # Kartu ringkasan total & jumlah transaksi hari ini
    │   │   ├── TransactionCard.tsx    # Kartu transaksi interaktif (edit/hapus)
    │   │   ├── TransactionList.tsx    # Daftar transaksi hari ini dengan empty state
    │   │   └── TransactionModal.tsx   # Modal drawer form (chips nominal & auto-kategori)
    │   ├── viewer/                    # Komponen antarmuka pemantauan realtime
    │   │   ├── BigTotalDisplay.tsx    # Banner utama total pengeluaran hari ini
    │   │   ├── CategoryChart.tsx      # Grafik donat Recharts dengan Center Info Hub
    │   │   ├── MonthlyRecapView.tsx   # Tampilan tab rekapitulasi analitik bulanan
    │   │   ├── MonthlySummary.tsx     # Ringkasan KPI bulanan & persentase kategori
    │   │   ├── MonthlyTable.tsx       # Tabel data transaksi bulanan lengkap
    │   │   ├── RealtimeTimeline.tsx   # Linimasa realtime dengan filter & pencarian
    │   │   ├── TimelineItem.tsx       # Item baris linimasa dengan status badge
    │   │   └── ViewerHeader.tsx       # Header viewer dengan pemilih tanggal
    │   └── pdf/                       # Modul generator laporan PDF formal
    │       ├── ExportPdfModal.tsx     # Modal status & progress bar download PDF
    │       └── PdfDocument.tsx        # Template dokumen A4 formal (multi-page dynamic)
    └── lib/                           # Utility & modul logic bisnis
        ├── categories.ts              # Engine klasifikasi kategori otomatis & skema warna
        ├── format.ts                  # Formatter Rupiah, jam, dan tanggal lokal Indonesia
        ├── pdf.ts                     # Controller pengekspor PDF multi-halaman (jsPDF)
        ├── realtime.ts                # Subscription helper channel Supabase Realtime
        ├── supabase.ts                # Inisialisasi client Supabase & definisi skema tipe
        ├── transactions.ts            # Data access layer CRUD transaksi
        └── utils.ts                   # Utility penggabung class CSS (clsx + tailwind-merge)
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

Buat project di [Supabase](https://supabase.com/), lalu jalankan script berikut di **SQL Editor**:

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

Salin `.env.local.example` ke `.env.local`, lalu masukkan kredensial Supabase Anda:

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://project-ref-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-supabase-anda
```

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka URL berikut di browser Anda:
- [http://localhost:3000/editor](http://localhost:3000/editor) — Mode pencatatan transaksi.
- [http://localhost:3000/ari](http://localhost:3000/ari) — Mode pemantauan realtime & laporan bulanan.

---

## 🤖 Konfigurasi Otomasi Supabase Keep-Alive (GitHub Actions)

Agar cron workflow dapat berjalan dengan otentikasi penuh ke Supabase:
1. Buka repositori Anda di GitHub: **Settings > Secrets and variables > Actions**.
2. Klik tombol **New repository secret**.
3. Buat secret bernama **`SUPABASE_ANON_KEY`** dengan nilai *Anon Key* Supabase Anda.
4. *(Opsional)* Jika URL project berbeda dari default, buat secret **`SUPABASE_URL`**.

---

<div align="center">
  <sub>Dibangun dengan kesederhanaan, transparansi, dan kecepatan menggunakan Next.js, Tailwind CSS, dan Supabase.</sub>
</div>
