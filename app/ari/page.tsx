import Link from "next/link";
import { formatHeaderDate, formatRupiah } from "@/lib/format";

export default function ViewerPage() {
  const today = formatHeaderDate(new Date());

  return (
    <main className="flex flex-col flex-1 px-4 py-6 pb-safe">
      {/* Viewer Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Jurnal Ari</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{today}</p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
            DUITKU
          </span>
          <p className="text-[10px] text-[#9CA3AF]">Realtime Viewer</p>
        </div>
      </header>

      {/* Big Total Display (Centered, Large Typography) */}
      <section className="mt-8 text-center p-8 rounded-[20px] bg-[#161616] border border-[#262626]">
        <span className="text-xs font-semibold tracking-widest text-[#9CA3AF] uppercase">
          TOTAL HARI INI
        </span>
        <div className="mt-3 text-4xl font-extrabold text-[#14B8A6] font-mono-num tracking-tight">
          {formatRupiah(0)}
        </div>
        <p className="text-xs text-[#9CA3AF] mt-2">
          Pembaruan otomatis saat editor mencatat pengeluaran
        </p>
      </section>

      {/* Realtime Timeline Placeholder */}
      <section className="mt-8 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Timeline Hari Ini
          </h2>
          <span className="text-xs text-[#9CA3AF]">Terbaru &rarr; Terlama</span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/40">
          <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-[#9CA3AF] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          </div>
          <p className="text-sm font-medium text-[#F5F5F5]">Menunggu aktivitas dari Ari</p>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-[240px]">
            Setiap pengeluaran yang dicatat akan langsung tampil di sini tanpa perlu refresh.
          </p>
        </div>
      </section>

      {/* Navigation Footer Shortcut */}
      <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#9CA3AF]">
        <span>Halaman: Viewer (Ari)</span>
        <Link
          href="/editor"
          className="text-[#14B8A6] hover:underline font-medium transition-colors"
        >
          &larr; Ke Halaman Editor
        </Link>
      </div>
    </main>
  );
}
