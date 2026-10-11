import React from "react";
import { formatHeaderDate } from "@/lib/format";

interface ViewerHeaderProps {
  isLive: boolean;
}

export function ViewerHeader({ isLive }: ViewerHeaderProps) {
  const today = formatHeaderDate(new Date());

  return (
    <header className="flex items-center justify-between pb-5 border-b border-[#262626]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Jurnal Ari</h1>
          
          {/* LIVE Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
              isLive
                ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                : "bg-amber-400/10 text-amber-400 border-amber-400/30"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? "bg-[#22C55E]" : "bg-amber-400"
                }`}
              ></span>
            </span>
            <span>{isLive ? "LIVE" : "SYNCING"}</span>
          </div>
        </div>

        <p className="text-xs text-[#9CA3AF] mt-1">{today}</p>
      </div>

      <div className="text-right">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF]">
          DUITKU
        </span>
        <p className="text-[10px] text-[#9CA3AF]/70">Family Viewer</p>
      </div>
    </header>
  );
}
