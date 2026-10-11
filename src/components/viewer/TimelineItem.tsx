import React from "react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah, formatTime } from "@/lib/format";

interface TimelineItemProps {
  transaction: Transaction;
  isRecent?: boolean;
}

export function TimelineItem({ transaction, isRecent }: TimelineItemProps) {
  return (
    <div
      className={`p-5 rounded-[20px] bg-[#161616] border transition-all duration-500 ${
        isRecent
          ? "border-[#22C55E]/60 shadow-lg shadow-[#22C55E]/10 animate-in fade-in slide-in-from-top-2"
          : "border-[#262626]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-num font-semibold text-[#9CA3AF]">
              {formatTime(transaction.created_at)}
            </span>
            {isRecent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] animate-pulse">
                Baru
              </span>
            )}
          </div>

          <h3 className="mt-1 text-base font-semibold text-[#F5F5F5] break-words">
            {transaction.item_name}
          </h3>

          {transaction.note && (
            <p className="mt-1 text-xs text-[#9CA3AF] break-words line-clamp-2">
              {transaction.note}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <span className="text-base sm:text-lg font-bold text-[#14B8A6] font-mono-num">
            {formatRupiah(transaction.amount)}
          </span>
        </div>
      </div>
    </div>
  );
}
