import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatRupiah, formatMonthYear } from "@/lib/format";

interface MonthlySummaryProps {
  currentDate: Date;
  totalAmount: number;
  transactionCount: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canNextMonth: boolean;
}

export function MonthlySummary({
  currentDate,
  totalAmount,
  transactionCount,
  onPrevMonth,
  onNextMonth,
  canNextMonth,
}: MonthlySummaryProps) {
  const monthName = formatMonthYear(currentDate);

  return (
    <div className="p-6 rounded-[20px] bg-[#161616] border border-[#262626] transition-all">
      {/* Month Selector Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#14B8A6]" />
          <span className="text-sm font-bold text-[#F5F5F5]">{monthName}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Bulan sebelumnya"
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#262626] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            disabled={!canNextMonth}
            aria-label="Bulan berikutnya"
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#262626] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#9CA3AF]">
            Total Pengeluaran
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#14B8A6] font-mono-num tracking-tight">
            {formatRupiah(totalAmount)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#9CA3AF]">
            Frekuensi
          </span>
          <div className="mt-1 text-base font-bold text-[#F5F5F5] font-mono-num">
            {transactionCount} Transaksi
          </div>
        </div>
      </div>
    </div>
  );
}
