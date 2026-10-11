import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah, formatTime } from "@/lib/format";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string, itemName: string) => void;
}

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const isOptimistic = transaction.id.startsWith("temp-");

  return (
    <div
      className={`relative p-5 rounded-[20px] bg-[#161616] border border-[#262626] transition-all duration-200 ${
        isOptimistic ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Konten Kiri: Waktu, Nama Barang, Catatan */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-num font-medium text-[#9CA3AF]">
              {formatTime(transaction.created_at)}
            </span>
            {isOptimistic && (
              <span className="text-[10px] text-[#9CA3AF] italic">
                (Menyimpan...)
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

        {/* Konten Kanan: Nominal & Tombol Aksi */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-base sm:text-lg font-bold text-[#14B8A6] font-mono-num">
            {formatRupiah(transaction.amount)}
          </span>

          <div className="flex items-center gap-1.5 mt-3">
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              disabled={isOptimistic}
              aria-label={`Ubah ${transaction.item_name}`}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#262626]/60 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(transaction.id, transaction.item_name)}
              disabled={isOptimistic}
              aria-label={`Hapus ${transaction.item_name}`}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#DC2626]/10 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
