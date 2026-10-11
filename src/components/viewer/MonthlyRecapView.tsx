"use client";

import React, { useMemo } from "react";
import { Download, FileText } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { aggregateByCategory } from "@/lib/categories";
import { MonthlySummary } from "./MonthlySummary";
import { CategoryChart } from "./CategoryChart";
import { MonthlyTable } from "./MonthlyTable";

interface MonthlyRecapViewProps {
  currentDate: Date;
  transactions: Transaction[];
  isLoading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canNextMonth: boolean;
  onDownloadPdf?: () => void;
}

export function MonthlyRecapView({
  currentDate,
  transactions,
  isLoading,
  onPrevMonth,
  onNextMonth,
  canNextMonth,
  onDownloadPdf,
}: MonthlyRecapViewProps) {
  // Hitung total nominal bulanan
  const totalAmount = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [transactions]);

  // Agregasi kategori dengan helper
  const categories = useMemo(() => {
    return aggregateByCategory(transactions);
  }, [transactions]);

  return (
    <section className="mt-10 pt-8 border-t border-[#262626]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
            Rekap Bulanan
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Analisis & statistik pengeluaran per bulan
          </p>
        </div>

        {transactions.length > 0 && (
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161616] border border-[#262626] text-xs font-medium text-[#14B8A6] hover:bg-[#262626] active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 rounded-[20px] bg-[#161616] border border-[#262626]"></div>
          <div className="h-48 rounded-[20px] bg-[#161616] border border-[#262626]"></div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Ringkasan Bulan */}
          <MonthlySummary
            currentDate={currentDate}
            totalAmount={totalAmount}
            transactionCount={transactions.length}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            canNextMonth={canNextMonth}
          />

          {/* Grafik Kategori Donut Recharts */}
          <CategoryChart categories={categories} totalAmount={totalAmount} />

          {/* Tabel Transaksi Bulanan */}
          <MonthlyTable transactions={transactions} />

          {/* Tombol Ekspor PDF di bagian bawah (jika ada data) */}
          {transactions.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onDownloadPdf}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#161616] border border-[#262626] text-xs font-bold uppercase tracking-wider text-[#F5F5F5] hover:border-[#14B8A6]/60 hover:text-[#14B8A6] active:scale-98 transition-all cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4 text-[#14B8A6]" />
                <span>Export Laporan PDF (A4)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
