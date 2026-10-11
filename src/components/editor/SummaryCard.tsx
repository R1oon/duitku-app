import React from "react";
import { formatRupiah } from "@/lib/format";

interface SummaryCardProps {
  totalAmount: number;
}

export function SummaryCard({ totalAmount }: SummaryCardProps) {
  return (
    <section className="mt-5 p-6 rounded-[20px] bg-[#161616] border border-[#262626] transition-all">
      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">
        Total Hari Ini
      </p>
      <div className="mt-2.5 text-3xl sm:text-4xl font-bold text-[#14B8A6] font-mono-num tracking-tight">
        {formatRupiah(totalAmount)}
      </div>
    </section>
  );
}
