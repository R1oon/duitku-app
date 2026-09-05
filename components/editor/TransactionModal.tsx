"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { item_name: string; amount: number; note?: string }) => void;
  initialData?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TransactionModalProps) {
  const [itemName, setItemName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const itemInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setItemName(initialData.item_name);
        setAmountStr(initialData.amount.toString());
        setNote(initialData.note || "");
      } else {
        setItemName("");
        setAmountStr("");
        setNote("");
      }
      setErrorMsg("");

      // Focus input
      setTimeout(() => {
        itemInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const parsedAmount = parseInt(amountStr.replace(/\D/g, ""), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = itemName.trim();
    if (!trimmedName) {
      setErrorMsg("Nama barang wajib diisi");
      itemInputRef.current?.focus();
      return;
    }

    if (parsedAmount <= 0) {
      setErrorMsg("Nominal pengeluaran harus lebih besar dari Rp0");
      return;
    }

    onSave({
      item_name: trimmedName,
      amount: parsedAmount,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      {/* Backdrop click handler */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-[430px] rounded-t-[28px] sm:rounded-[28px] bg-[#161616] border border-[#262626] p-6 pb-8 z-10 shadow-2xl transition-all animate-in slide-in-from-bottom duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">
              {isEditing ? "Ubah Pengeluaran" : "Catat Pengeluaran"}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {isEditing ? "Perbarui catatan yang dipilih" : "Waktu dicatat otomatis"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-full text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#262626] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-xs text-[#DC2626]">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Field: Nama Barang */}
          <div>
            <label
              htmlFor="item_name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5"
            >
              Nama Barang <span className="text-[#DC2626]">*</span>
            </label>
            <input
              ref={itemInputRef}
              id="item_name"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Contoh: Bakso, Es Teh, Bensin"
              className="w-full px-4 py-3 rounded-2xl bg-[#0D0D0D] border border-[#262626] text-[#F5F5F5] placeholder-[#9CA3AF]/40 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
            />
          </div>

          {/* Field: Nominal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="amount"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]"
              >
                Nominal (Rp) <span className="text-[#DC2626]">*</span>
              </label>
              {parsedAmount > 0 && (
                <span className="text-xs font-bold font-mono-num text-[#14B8A6]">
                  {formatRupiah(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold font-mono-num text-[#9CA3AF]">
                Rp
              </span>
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                required
                value={amountStr}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setAmountStr(val ? parseInt(val, 10).toLocaleString("id-ID") : "");
                }}
                placeholder="10.000"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#0D0D0D] border border-[#262626] text-[#F5F5F5] font-mono-num placeholder-[#9CA3AF]/40 text-base font-semibold focus:outline-none focus:border-[#14B8A6] transition-colors"
              />
            </div>
          </div>

          {/* Field: Catatan Tambahan (Opsional) */}
          <div>
            <label
              htmlFor="note"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5"
            >
              Catatan <span className="text-[10px] text-[#9CA3AF]/60 lowercase">(opsional)</span>
            </label>
            <textarea
              id="note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Habis ujian, beli bareng teman"
              className="w-full px-4 py-3 rounded-2xl bg-[#0D0D0D] border border-[#262626] text-[#F5F5F5] placeholder-[#9CA3AF]/40 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-full bg-[#0D0D0D] border border-[#262626] text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F5F5] active:scale-95 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-4 rounded-full bg-[#14B8A6] text-[#0D0D0D] text-xs font-bold uppercase tracking-wider hover:bg-[#0d9488] active:scale-95 transition-all shadow-md shadow-[#14B8A6]/20 cursor-pointer"
            >
              {isEditing ? "Simpan Perubahan" : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
