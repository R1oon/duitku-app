import Link from "next/link";
import { ArrowRight, BookOpen, Eye } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1 justify-center px-6 py-10 pb-safe">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6]"></span>
          <span className="text-xs font-semibold tracking-wider text-[#9CA3AF] uppercase">
            Black Journal Edition
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#F5F5F5]">DUITKU</h1>
        <p className="text-sm text-[#9CA3AF] mt-2 max-w-[280px] mx-auto">
          Jurnal pengeluaran harian dengan dashboard realtime untuk keluarga.
        </p>
      </div>

      <div className="space-y-4">
        {/* Editor Entry */}
        <Link
          href="/editor"
          className="group block p-5 rounded-[20px] bg-[#161616] border border-[#262626] hover:border-[#14B8A6]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center text-[#14B8A6] group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F5F5F5]">Buka Editor Jurnal</h2>
                <p className="text-xs text-[#9CA3AF]">Input dan kelola transaksi harian</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#14B8A6] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Viewer Entry */}
        <Link
          href="/ari"
          className="group block p-5 rounded-[20px] bg-[#161616] border border-[#262626] hover:border-[#22C55E]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center text-[#22C55E] group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#F5F5F5]">Viewer Realtime</h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-semibold border border-[#22C55E]/20">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Pantau jurnal Ari secara langsung</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#22C55E] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[11px] text-[#9CA3AF]/60 tracking-wider">
          ZERO FRICTION • NO LOGIN • REALTIME
        </p>
      </div>
    </main>
  );
}
