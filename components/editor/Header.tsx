import React from "react";
import { formatHeaderDate } from "@/lib/format";

interface HeaderProps {
  status: "connected" | "connecting" | "error";
}

export function Header({ status }: HeaderProps) {
  const today = formatHeaderDate(new Date());

  return (
    <header className="flex items-center justify-between pb-5 border-b border-[#262626]">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Jurnal Pengeluaran
        </span>
        <h1 className="text-2xl font-black tracking-tight text-[#F5F5F5]">DUITKU</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{today}</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616] border border-[#262626]">
        {status === "connected" && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
            </span>
            <span className="text-[11px] font-medium text-[#22C55E]">Connected</span>
          </>
        )}

        {status === "connecting" && (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-medium text-amber-400">Connecting</span>
          </>
        )}

        {status === "error" && (
          <>
            <span className="h-2 w-2 rounded-full bg-[#DC2626]"></span>
            <span className="text-[11px] font-medium text-[#DC2626]">Offline</span>
          </>
        )}
      </div>
    </header>
  );
}
