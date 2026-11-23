import Link from "next/link";
import { ArrowRight, BookOpen, Eye, Zap, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1 justify-center px-6 py-10 pb-safe">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wider text-[#A1A1AA] uppercase">
            Black Journal Edition
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F5]">DUITKU</h1>
        <p className="text-sm text-[#A1A1AA] mt-2.5 max-w-[300px] mx-auto leading-relaxed">
          Jurnal pengeluaran harian dengan dashboard realtime untuk keluarga.
        </p>
      </div>

      <div className="space-y-4">
        {/* Editor Entry */}
        <Link
          href="/editor"
          className="group block p-5 rounded-[22px] bg-[#161616] border border-[#262626] hover:border-[#14B8A6]/50 active:scale-99 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-center text-[#14B8A6] group-hover:scale-105 group-hover:border-[#14B8A6]/40 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#F5F5F5]">Editor Jurnal</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] font-semibold border border-[#14B8A6]/20">
                    Pencatat
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">Input & kelola transaksi harian (Ari)</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Viewer Entry */}
        <Link
          href="/ari"
          className="group block p-5 rounded-[22px] bg-[#161616] border border-[#262626] hover:border-[#22C55E]/50 active:scale-99 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-center text-[#22C55E] group-hover:scale-105 group-hover:border-[#22C55E]/40 transition-all">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#F5F5F5]">Viewer Realtime</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-bold border border-[#22C55E]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">Pantau pengeluaran realtime (Orang Tua)</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Feature Badges */}
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap text-[11px] text-[#A1A1AA]">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616]/80 border border-[#262626]">
          <Zap className="w-3 h-3 text-[#14B8A6]" />
          <span>Optimistic 0ms Latency</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616]/80 border border-[#262626]">
          <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
          <span>Zero Friction • No Login</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-[#A1A1AA]/70 tracking-widest font-mono-num uppercase">
          DUITKU v1.1 • MOBILE FIRST PWA
        </p>
      </div>
    </main>
  );
}
