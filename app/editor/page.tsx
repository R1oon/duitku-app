import Link from "next/link";
import { formatHeaderDate, formatRupiah } from "@/lib/format";

export default function EditorPage() {
  const today = formatHeaderDate(new Date());

  return (
    <main className="flex flex-col flex-1 px-4 py-6 pb-safe">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Jurnal Pribadi
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">DUITKU</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{today}</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616] border border-[#262626]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
          </span>
          <span className="text-xs font-medium text-[#9CA3AF]">Ready</span>
        </div>
      </header>

      {/* Summary Card */}
      <section className="mt-6 p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
          Total Hari Ini
        </p>
        <div className="mt-2 text-3xl font-bold text-[#14B8A6] font-mono-num tracking-tight">
          {formatRupiah(0)}
        </div>
      </section>

      {/* Transaction List Section */}
      <section className="mt-8 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Catatan Pengeluaran
          </h2>
          <span className="text-xs text-[#9CA3AF]">0 Transaksi</span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/40">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-[#9CA3AF] mb-3">
            <svg
              className="w-6 h-6 text-[#9CA3AF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#F5F5F5]">Belum ada pengeluaran hari ini</p>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-[240px]">
            Ketuk tombol tambah di bawah untuk mulai mencatat pengeluaran.
          </p>
        </div>
      </section>

      {/* Navigation Footer Shortcut */}
      <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#9CA3AF]">
        <span>Halaman: Editor</span>
        <Link
          href="/ari"
          className="text-[#14B8A6] hover:underline font-medium transition-colors"
        >
          Lihat Viewer (/ari) &rarr;
        </Link>
      </div>
    </main>
  );
}
