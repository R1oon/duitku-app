import React from "react";
import { PlusCircle } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string, itemName: string) => void;
  onOpenAddModal: () => void;
}

export function TransactionList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onOpenAddModal,
}: TransactionListProps) {
  return (
    <section className="mt-7 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Catatan Hari Ini
        </h2>
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
                  <div className="h-3 w-20 bg-[#262626] rounded"></div>
                </div>
                <div className="h-5 w-24 bg-[#262626] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/40 my-auto">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-[#9CA3AF] mb-3.5">
            <PlusCircle className="w-6 h-6 text-[#9CA3AF]" />
          </div>
          <p className="text-sm font-semibold text-[#F5F5F5]">
            Belum ada pengeluaran hari ini
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-[240px] leading-relaxed">
            Tekan tombol (+) di pojok kanan bawah untuk mulai mencatat pengeluaran Anda.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-4 px-4 py-2 rounded-full bg-[#161616] border border-[#262626] text-xs font-medium text-[#14B8A6] hover:bg-[#262626]/50 active:scale-95 transition-all"
          >
            + Catat Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3 pb-24">
          {transactions.map((item) => (
            <TransactionCard
              key={item.id}
              transaction={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
