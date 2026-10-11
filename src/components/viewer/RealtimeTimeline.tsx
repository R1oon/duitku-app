import React from "react";
import { Clock } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { TimelineItem } from "./TimelineItem";

interface RealtimeTimelineProps {
  transactions: Transaction[];
  isLoading: boolean;
  recentIds: Set<string>;
}

export function RealtimeTimeline({
  transactions,
  isLoading,
  recentIds,
}: RealtimeTimelineProps) {
  return (
    <section className="mt-7 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Timeline Hari Ini
          </h2>
          <span className="text-[10px] text-[#9CA3AF]/60">Terbaru &rarr; Terlama</span>
        </div>
        <span className="text-xs font-mono-num text-[#9CA3AF]">
          {transactions.length} Transaksi
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-[20px] bg-[#161616] border border-[#262626] animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-12 bg-[#262626] rounded"></div>
                  <div className="h-4 w-32 bg-[#262626] rounded"></div>
                </div>
                <div className="h-5 w-24 bg-[#262626] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/40 my-auto">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-[#9CA3AF] mb-3.5">
            <Clock className="w-6 h-6 text-[#9CA3AF]" />
          </div>
          <p className="text-sm font-semibold text-[#F5F5F5]">
            Menunggu aktivitas dari Ari
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-[250px] leading-relaxed">
            Setiap catatan pengeluaran baru dari Ari akan langsung muncul di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {transactions.map((item) => (
            <TimelineItem
              key={item.id}
              transaction={item}
              isRecent={recentIds.has(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
