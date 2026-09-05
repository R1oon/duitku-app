"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onCancel} aria-hidden="true" />

      <div className="relative w-full max-w-[360px] rounded-[28px] bg-[#161616] border border-[#262626] p-6 z-10 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-center justify-center mx-auto text-[#DC2626] mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-[#F5F5F5]">Hapus Pengeluaran?</h3>
        <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
          Catatan <span className="font-semibold text-[#F5F5F5]">"{itemName}"</span> akan dihapus permanen dari jurnal.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-full bg-[#0D0D0D] border border-[#262626] text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F5F5] active:scale-95 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-full bg-[#DC2626] text-[#F5F5F5] text-xs font-bold uppercase tracking-wider hover:bg-[#b91c1c] active:scale-95 transition-all shadow-md shadow-[#DC2626]/20 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
