# DUITKU — Master Project Blueprint & PRD (V1)

> **Version:** 1.0.0 (MVP)
> **Tagline:** Jurnal pengeluaran harian dengan dashboard realtime untuk keluarga.

---

# 1. PROJECT OVERVIEW & PHILOSOPHY

## Project Identity

**Project Name:** DUITKU

**Product Type:** Mobile-First Progressive Web Application (PWA)

**Primary Users:**
- **Editor:** Pemilik jurnal (mahasiswa/pelajar)
- **Viewer:** Orang tua atau wali yang memantau pengeluaran secara realtime

## Problem Statement

Pelaporan pengeluaran harian masih dilakukan secara manual melalui buku catatan atau foto screenshot. Proses tersebut memiliki tiga kelemahan utama:

1. Data tidak realtime.
2. Orang tua harus meminta laporan terlebih dahulu.
3. Rekap bulanan tidak konsisten dan sulit dicetak.

DUITKU mengubah proses tersebut menjadi **single-input realtime sharing**.

**Prinsip utama:**

> Catat sekali → seluruh dashboard viewer langsung diperbarui.

## Core Principles

### 1. Zero Friction

- Tidak ada Login
- Tidak ada Register
- Tidak ada PIN
- Tidak ada OTP
- Tidak ada proses autentikasi

### 2. Mobile First

Semua UI didesain terlebih dahulu untuk layar 390–430px.

### 3. Realtime Transparency

Editor menjadi satu-satunya sumber input, sedangkan Viewer hanya membaca data secara realtime.

---

# 2. TECH STACK & INFRASTRUCTURE

| Layer | Technology | Reason |
|------|------------|--------|
| Frontend | Next.js 15 (App Router) | Routing modern, Server Components, PWA ready |
| Styling | Tailwind CSS v4 | Utility-first, cepat, konsisten |
| Database | Supabase PostgreSQL | Gratis & mudah digunakan |
| Realtime | Supabase Realtime | Live update tanpa refresh |
| Charts | Recharts | Ringan dan React native |
| PDF | jsPDF + html2canvas | Export laporan A4 |
| Hosting | Vercel | Gratis & deployment instan |

## Folder Structure

```text
app/
 ├── editor/
 │    └── page.tsx
 ├── ari/
 │    └── page.tsx
 ├── globals.css
 └── layout.tsx

components/
 ├── editor/
 ├── viewer/
 ├── shared/
 └── pdf/

lib/
 ├── supabase.ts
 ├── realtime.ts
 ├── utils.ts
 └── format.ts
```

---

# 3. DATABASE SCHEMA (SUPABASE)

## Table: transactions

```sql
create table public.transactions (
    id uuid primary key default gen_random_uuid(),

    created_at timestamptz not null default now(),

    item_name text not null,

    amount integer not null check (amount > 0),

    note text
);
```

## Column Specification

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | ❌ | Primary Key |
| created_at | TIMESTAMPTZ | ❌ | Auto timestamp |
| item_name | TEXT | ❌ | Nama barang |
| amount | INTEGER | ❌ | Nominal rupiah |
| note | TEXT | ✅ | Catatan tambahan |

## Realtime Configuration

Enable Realtime pada table:

```sql
alter publication supabase_realtime
add table transactions;
```

## RLS Policy (V1)

> Karena V1 **tidak menggunakan Authentication**, seluruh akses bersifat anonim.

```sql
alter table transactions enable row level security;

create policy "public_read"
on transactions
for select
using (true);

create policy "public_insert"
on transactions
for insert
with check (true);

create policy "public_update"
on transactions
for update
using (true);

create policy "public_delete"
on transactions
for delete
using (true);
```

> **Catatan:** Ini disengaja untuk MVP dan hanya digunakan pada project personal.

---

# 4. DESIGN SYSTEM — BLACK JOURNAL

## Design Language

Black Journal adalah kombinasi jurnal pribadi dengan nuansa premium minimalis.

### Color Palette

| Token | Hex | Usage |
|--------|-----|-------|
| Background | `#0D0D0D` | Matte Black |
| Surface | `#161616` | Card |
| Border | `#262626` | Divider |
| Primary Text | `#F5F5F5` | Judul |
| Secondary Text | `#9CA3AF` | Caption |
| Accent Red | `#DC2626` | Badge tanggal |
| Accent Teal | `#14B8A6` | Nominal |
| Success | `#22C55E` | Status LIVE |

## Typography

### Primary Font

**Inter**

Weights:

- 400 Regular
- 500 Medium
- 600 SemiBold
- 700 Bold

### Number Font

`Roboto Mono`

Digunakan khusus untuk:

- Nominal uang
- Jam transaksi

Contoh:

```text
12:41
Rp10.000
```

## Radius

| Component | Radius |
|-----------|--------|
| Card | 20px |
| Button | 999px |
| Modal | 28px |

## Spacing Scale

| Token | Size |
|--------|------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

## Component Rules

- Flat design
- Tanpa shadow besar
- Border tipis 1px
- Dominasi ruang kosong
- Mobile-first
- Bottom safe area diperhatikan

---

# 5. PAGE ARCHITECTURE & COMPONENT TREE

## Route 1 — /editor

### Purpose

Halaman utama untuk mencatat transaksi.

### Component Tree

```text
EditorPage
│
├── Header
│     ├── Logo
│     ├── CurrentDate
│     └── ConnectionStatus
│
├── SummaryCard
│     └── TodayTotal
│
├── TransactionList
│     ├── TransactionCard
│     ├── TransactionCard
│     └── TransactionCard
│
├── FloatingAddButton
│
├── AddTransactionModal
│     ├── ItemInput
│     ├── AmountInput
│     ├── NoteInput
│     └── SaveButton
│
└── ExportPDFButton
```

## Header

### Elements

- DUITKU Logo
- Hari & Tanggal
- Status Database

Contoh status:

```text
● Connected
```

## SummaryCard

Menampilkan satu metrik.

```text
Total Hari Ini

Rp26.000
```

Tidak ada statistik lain.

## TransactionCard

### Props

```ts
type Transaction = {
  id: string
  created_at: string
  item_name: string
  amount: number
  note?: string
}
```

### Layout

```text
12:41

Bakso

Habis ujian

Rp10.000
```

### Actions

- Edit
- Delete

## AddTransactionModal

### Fields

| Field | Type | Required |
|------|------|----------|
| item_name | text | ✅ |
| amount | number | ✅ |
| note | textarea | ❌ |

Jam & tanggal otomatis.

---

# Route 2 — /ari

## Purpose

Dashboard realtime khusus viewer.

### Component Tree

```text
ViewerPage
│
├── ViewerHeader
│
├── BigTotalDisplay
│
├── RealtimeTimeline
│     ├── TimelineItem
│     └── TimelineItem
│
└── MonthlyRecapView
      ├── MonthlySummary
      ├── CategoryChart
      ├── MonthlyTable
      └── DownloadButton
```

## ViewerHeader

Elements:

- Nama Jurnal (Ari)
- LIVE Badge
- Current Date

## BigTotalDisplay

```text
TOTAL HARI INI

Rp26.000
```

Centered.

Large typography.

## RealtimeTimeline

Sorting:

Newest → Oldest

Example:

```text
15:20

Le Minerale

Rp4.000

----------------

12:41

Bakso

Rp10.000
```

Auto update menggunakan subscription.

## MonthlyRecapView

Contains:

### Summary

- Nama Bulan
- Total Pengeluaran
- Jumlah Transaksi

### Chart

Kategori berdasarkan keyword sederhana.

### Table

| Tanggal | Barang | Nominal |
|---------|--------|---------|

### Download

Button:

```text
Download PDF
```

---

# 6. STATE MANAGEMENT & DATA FLOW

## Global Strategy

Menggunakan React State + Supabase Client.

Tidak menggunakan Redux/Zustand pada V1.

## Editor Flow

```text
User Input
      │
      ▼
Local State
      │
      ▼
Optimistic UI
      │
      ▼
Supabase Insert
      │
      ▼
Realtime Broadcast
      │
      ▼
Viewer Update
```

## Optimistic UI

Saat tombol Simpan ditekan:

1. Modal ditutup.
2. Card langsung muncul.
3. Request insert dikirim.
4. Jika gagal → rollback.

Pseudo:

```ts
setTransactions(prev => [newItem, ...prev])

await supabase
  .from("transactions")
  .insert(newItem)
```

## Viewer Flow

Viewer subscribe ke channel:

```ts
supabase
.channel("transactions")
.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "transactions",
  },
  handleRealtime
)
.subscribe()
```

### Event Handling

| Event | Action |
|--------|--------|
| INSERT | Tambah card |
| UPDATE | Update card |
| DELETE | Remove card |

Tidak pernah refresh halaman.

---

# 7. EXPORT PDF SPECIFICATION

Format: **A4 Portrait**

Margin: 18mm

## Page 1 — Cover

```text
DUITKU

Laporan Pengeluaran

November 2026

Ari
```

### Content

- Logo
- Judul
- Nama Bulan
- Generated Date

---

## Page 2 — Summary

### Metrics

- Total Pengeluaran
- Jumlah Transaksi

### Chart

Pie / Bar

Kategori:

- Makanan
- Minuman
- Transport
- Belanja
- Lainnya

---

## Page 3 — Full Table

| Tanggal | Jam | Barang | Nominal |
|---------|-----|--------|---------|

Footer:

```text
Generated by DUITKU
```

Nominal selalu format:

```text
Rp10.000
```

---

# 8. STRICT BOUNDARIES (ANTI-HALLUCINATION GUARDRAILS)

## ❌ AI MUST NEVER ADD THESE FEATURES

- [ ] Authentication
- [ ] Login
- [ ] Register
- [ ] Google OAuth
- [ ] PIN
- [ ] OTP
- [ ] User Profile
- [ ] Multi-user Account
- [ ] Family Invitation
- [ ] Users Table
- [ ] Roles Table
- [ ] Budget Harian
- [ ] Saldo Awal
- [ ] Sisa Saldo
- [ ] Transfer Uang
- [ ] Pemasukan (Income)
- [ ] Wallet
- [ ] AI Insight
- [ ] Notification
- [ ] WhatsApp Integration
- [ ] Telegram Bot

## Hard Rules

1. Hanya ada **1 tabel utama** (`transactions`)
2. Hanya ada **2 halaman** (`/editor`, `/ari`)
3. Tidak boleh membuat endpoint auth
4. Semua data bersifat publik (MVP)
5. Fokus hanya pada pengeluaran

---

# 9. EXECUTION ROADMAP (VIBE CODING PHASES)

## PHASE 1 — Project Foundation

**Goal:** Inisialisasi project

Tasks:

- Create Next.js App Router
- Install Tailwind
- Setup Supabase Client
- Configure Environment Variables
- Setup Global Layout
- Setup Black Journal Theme

Deliverable:

> Empty project with routing working.

---

## PHASE 2 — Database Integration

Tasks:

- Create `transactions` table
- Enable Realtime
- Create CRUD helper
- Test Insert & Select

Deliverable:

> Database fully connected.

---

## PHASE 3 — Editor UI

Tasks:

- Build Header
- Build SummaryCard
- Build TransactionCard
- Build TransactionList
- Build Floating Button
- Build Add Modal
- Implement Create
- Implement Edit
- Implement Delete

Deliverable:

> Editor completely functional.

---

## PHASE 4 — Realtime Viewer

Tasks:

- Build Viewer Header
- Build Big Total
- Build Timeline
- Implement Supabase Subscription
- Handle INSERT
- Handle UPDATE
- Handle DELETE

Deliverable:

> Viewer updates live without refresh.

---

## PHASE 5 — Monthly Recap

Tasks:

- Monthly filtering
- Calculate total
- Count transactions
- Build category aggregation
- Build Recharts visualization
- Build monthly table

Deliverable:

> Complete analytics page.

---

## PHASE 6 — PDF & PWA

Tasks:

- Generate 3-page PDF
- Format A4
- Export button
- Add manifest.json
- Add icons
- Enable Install to Home Screen
- Final responsive testing

Deliverable:

> Production-ready DUITKU V1.
s