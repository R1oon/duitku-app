import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah, formatTime } from "@/lib/format";
import { categorizeItem, CATEGORY_COLORS } from "@/lib/categories";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string, itemName: string) => void;
}

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const isOptimistic = transaction.id.startsWith("temp-");
  const category = categorizeItem(transaction.item_name);
  const categoryColor = CATEGORY_COLORS[category];

  return (
    <div
      className={`relative p-5 rounded-[20px] bg-[#161616] border border-[#262626] hover:border-[#383838] transition-all duration-200 ${
        isOptimistic ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Konten Kiri: Waktu, Kategori, Nama Barang, Catatan */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono-num font-medium text-[#A1A1AA]">
              {formatTime(transaction.created_at)}
            </span>
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border"
              style={{
                color: categoryColor,
                borderColor: `${categoryColor}35`,
                backgroundColor: `${categoryColor}12`,
              }}
            >
              {category}
            </span>
            {isOptimistic && (
              <span className="text-[10px] text-[#A1A1AA] italic">
                (Menyimpan...)
              </span>
            )}
          </div>

          <h3 className="mt-1.5 text-base font-semibold text-[#F5F5F5] break-words">
            {transaction.item_name}
          </h3>

          {transaction.note && (
            <p className="mt-1 text-xs text-[#A1A1AA] break-words line-clamp-2">
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
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#262626] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(transaction.id, transaction.item_name)}
              disabled={isOptimistic}
              aria-label={`Hapus ${transaction.item_name}`}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#DC2626] hover:bg-[#DC2626]/10 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
