import React from "react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah, formatShortDate, formatTime } from "@/lib/format";
import { categorizeItem, CATEGORY_COLORS } from "@/lib/categories";

interface MonthlyTableProps {
  transactions: Transaction[];
}

export function MonthlyTable({ transactions }: MonthlyTableProps) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-[20px] bg-[#161616] border border-[#262626] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#262626] flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Rincian Transaksi Bulanan
        </h3>
        <span className="text-xs font-mono-num text-[#9CA3AF]">
          {transactions.length} Data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#262626] bg-[#0D0D0D]/50 text-[11px] uppercase tracking-wider text-[#9CA3AF]">
              <th className="py-3 px-4 font-semibold">Waktu</th>
              <th className="py-3 px-4 font-semibold">Barang</th>
              <th className="py-3 px-4 font-semibold text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]/60 text-xs">
            {transactions.map((tx) => {
              const category = categorizeItem(tx.item_name);
              const categoryColor = CATEGORY_COLORS[category];

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-[#1f1f1f]/50 transition-colors"
                >
                  {/* Kolom Waktu: Tanggal + Jam */}
                  <td className="py-3 px-4 whitespace-nowrap text-[#9CA3AF] font-mono-num align-top">
                    <div>{formatShortDate(tx.created_at)}</div>
                    <div className="text-[10px] text-[#9CA3AF]/60">{formatTime(tx.created_at)}</div>
                  </td>

                  {/* Kolom Barang + Kategori + Catatan */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-semibold text-[#F5F5F5] break-words">
                      {tx.item_name}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          color: categoryColor,
                          borderColor: `${categoryColor}40`,
                          backgroundColor: `${categoryColor}15`,
                        }}
                      >
                        {category}
                      </span>

                      {tx.note && (
                        <span className="text-[11px] text-[#9CA3AF]/70 italic truncate max-w-[150px]">
                          {tx.note}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Kolom Nominal */}
                  <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-[#14B8A6] font-mono-num align-top">
                    {formatRupiah(tx.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
