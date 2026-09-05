import React from "react";
import { formatRupiah } from "@/lib/format";

interface BigTotalDisplayProps {
  totalAmount: number;
}

export function BigTotalDisplay({ totalAmount }: BigTotalDisplayProps) {
  return (
    <section className="mt-6 text-center p-7 sm:p-8 rounded-[20px] bg-[#161616] border border-[#262626] transition-all">
      <span className="text-xs font-semibold tracking-widest text-[#9CA3AF] uppercase">
        TOTAL HARI INI
      </span>
      <div className="mt-2.5 text-4xl sm:text-5xl font-extrabold text-[#14B8A6] font-mono-num tracking-tight transition-all">
        {formatRupiah(totalAmount)}
      </div>
      <p className="text-xs text-[#9CA3AF] mt-2">
        Data diperbarui otomatis tanpa perlu refresh
      </p>
    </section>
  );
}
