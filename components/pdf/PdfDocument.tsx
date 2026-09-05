import React from "react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah, formatMonthYear, formatHeaderDate, formatShortDate, formatTime } from "@/lib/format";
import { aggregateByCategory, CATEGORY_COLORS, CategoryName } from "@/lib/categories";

interface PdfDocumentProps {
  currentDate: Date;
  transactions: Transaction[];
  ownerName?: string;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  ({ currentDate, transactions, ownerName = "Ari" }, ref) => {
    const monthName = formatMonthYear(currentDate);
    const generatedDate = formatHeaderDate(new Date());

    const totalAmount = transactions.reduce((sum, item) => sum + (item.amount || 0), 0);
    const categories = aggregateByCategory(transactions);

    // Semua kategori baku sesuai blueprint
    const standardCategories: CategoryName[] = ["Makanan", "Minuman", "Transport", "Belanja", "Lainnya"];

    return (
      <div
        ref={ref}
        className="font-sans text-[#F5F5F5] bg-[#0D0D0D]"
        style={{
          width: "794px", // Standard A4 width at 96 DPI
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
      >
        {/* ===================================================
            PAGE 1 — COVER
            =================================================== */}
        <div
          id="pdf-page-1"
          className="relative flex flex-col justify-between bg-[#0D0D0D] border-b border-[#262626]"
          style={{
            width: "794px",
            height: "1123px", // Standard A4 height at 96 DPI
            padding: "68px",  // 18mm margin
            boxSizing: "border-box",
          }}
        >
          {/* Header Cover */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <span className="text-lg font-black text-[#14B8A6]">D</span>
              </div>
              <span className="text-xl font-black tracking-widest text-[#F5F5F5]">DUITKU</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-[11px] font-semibold text-[#9CA3AF] tracking-wider uppercase">
              Black Journal Edition
            </div>
          </div>

          {/* Body Cover */}
          <div className="my-auto text-center space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              Laporan Keuangan Keluarga
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-[#F5F5F5] leading-tight">
              Laporan Pengeluaran
            </h1>

            <div className="text-3xl font-light text-[#14B8A6] tracking-wide">
              {monthName}
            </div>

            <div className="pt-8">
              <span className="text-xs uppercase tracking-widest text-[#9CA3AF] block mb-1">
                Pemilik Jurnal
              </span>
              <span className="text-2xl font-bold text-[#F5F5F5]">{ownerName}</span>
            </div>
          </div>

          {/* Footer Cover */}
          <div className="border-t border-[#262626] pt-6 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Tanggal Cetak: {generatedDate}</span>
            <span>DUITKU V1 • Realtime Family Journal</span>
          </div>
        </div>

        {/* ===================================================
            PAGE 2 — SUMMARY & CATEGORY CHART
            =================================================== */}
        <div
          id="pdf-page-2"
          className="relative flex flex-col justify-between bg-[#0D0D0D] border-b border-[#262626]"
          style={{
            width: "794px",
            height: "1123px",
            padding: "68px",
            boxSizing: "border-box",
          }}
        >
          {/* Header Page 2 */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-5">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9CA3AF]">
                DUITKU • Ringkasan Eksekutif
              </span>
              <h2 className="text-xl font-extrabold text-[#F5F5F5]">Ringkasan {monthName}</h2>
            </div>
            <span className="text-xs text-[#9CA3AF] font-mono">Ari</span>
          </div>

          {/* Content Page 2 */}
          <div className="flex-1 py-8 space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-5">
              <div className="p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Total Pengeluaran
                </span>
                <div className="mt-2 text-3xl font-black text-[#14B8A6] font-mono">
                  {formatRupiah(totalAmount)}
                </div>
              </div>

              <div className="p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Jumlah Transaksi
                </span>
                <div className="mt-2 text-3xl font-black text-[#F5F5F5] font-mono">
                  {transactions.length} <span className="text-base font-medium text-[#9CA3AF]">Catatan</span>
                </div>
              </div>
            </div>

            {/* Visual Distribution Bars */}
            <div className="p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-5">
                Distribusi Kategori Pengeluaran
              </h3>

              <div className="space-y-4">
                {standardCategories.map((catName) => {
                  const catData = categories.find((c) => c.name === catName);
                  const val = catData?.value || 0;
                  const count = catData?.count || 0;
                  const percent = totalAmount > 0 ? (val / totalAmount) * 100 : 0;
                  const color = CATEGORY_COLORS[catName];

                  return (
                    <div key={catName} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-semibold text-[#F5F5F5]">{catName}</span>
                          <span className="text-[11px] text-[#9CA3AF] font-mono">
                            ({count}x)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-[#9CA3AF] font-mono">
                            {percent.toFixed(1)}%
                          </span>
                          <span className="font-bold text-[#F5F5F5] font-mono">
                            {formatRupiah(val)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#0D0D0D] border border-[#262626] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(percent, 0)}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Page 2 */}
          <div className="border-t border-[#262626] pt-4 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Generated by DUITKU</span>
            <span>Halaman 2 dari 3</span>
          </div>
        </div>

        {/* ===================================================
            PAGE 3 — FULL TABLE
            =================================================== */}
        <div
          id="pdf-page-3"
          className="relative flex flex-col justify-between bg-[#0D0D0D]"
          style={{
            width: "794px",
            height: "1123px",
            padding: "68px",
            boxSizing: "border-box",
          }}
        >
          {/* Header Page 3 */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-5">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9CA3AF]">
                DUITKU • Daftar Lengkap
              </span>
              <h2 className="text-xl font-extrabold text-[#F5F5F5]">Tabel Transaksi — {monthName}</h2>
            </div>
            <span className="text-xs text-[#9CA3AF] font-mono">
              Total: {transactions.length} Item
            </span>
          </div>

          {/* Table Page 3 */}
          <div className="flex-1 py-6 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#262626] text-[#9CA3AF] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 font-bold w-24">Tanggal</th>
                  <th className="py-2.5 px-3 font-bold w-16">Jam</th>
                  <th className="py-2.5 px-3 font-bold">Barang</th>
                  <th className="py-2.5 px-3 font-bold text-right w-28">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]/60 font-sans">
                {transactions.slice(0, 22).map((tx) => (
                  <tr key={tx.id} className="text-[#F5F5F5]">
                    <td className="py-2 px-3 whitespace-nowrap text-[#9CA3AF] font-mono">
                      {formatShortDate(tx.created_at)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-[#9CA3AF] font-mono">
                      {formatTime(tx.created_at)}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-semibold">{tx.item_name}</span>
                      {tx.note && (
                        <span className="text-[10px] text-[#9CA3AF] block italic">
                          {tx.note}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-bold text-[#14B8A6] font-mono">
                      {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length > 22 && (
              <p className="text-[10px] text-[#9CA3AF] italic text-center mt-3">
                * Menampilkan 22 transaksi pertama pada halaman laporan ringkas ini.
              </p>
            )}
          </div>

          {/* Footer Page 3 (Sesuai Blueprint: "Generated by DUITKU") */}
          <div className="border-t border-[#262626] pt-4 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span className="font-semibold text-[#F5F5F5]">Generated by DUITKU</span>
            <span>Halaman 3 dari 3</span>
          </div>
        </div>
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
