"use client";

import React from "react";
import { Loader2, FileCheck } from "lucide-react";

interface ExportPdfModalProps {
  isOpen: boolean;
  statusText: string;
  isComplete: boolean;
}

export function ExportPdfModal({
  isOpen,
  statusText,
  isComplete,
}: ExportPdfModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-[340px] rounded-[28px] bg-[#161616] border border-[#262626] p-7 text-center shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center mx-auto text-[#14B8A6] mb-4">
          {isComplete ? (
            <FileCheck className="w-7 h-7 text-[#22C55E]" />
          ) : (
            <Loader2 className="w-7 h-7 animate-spin text-[#14B8A6]" />
          )}
        </div>

        <h3 className="text-base font-bold text-[#F5F5F5]">
          {isComplete ? "PDF Berhasil Diunduh!" : "Membuat Laporan PDF"}
        </h3>

        <p className="text-xs text-[#9CA3AF] mt-2 font-medium">
          {statusText || "Mohon tunggu sebentar..."}
        </p>

        <div className="mt-5 text-[11px] text-[#9CA3AF]/60 uppercase tracking-widest font-semibold">
          Format A4 Portrait • Dokumen Cetak Formal
        </div>
      </div>
    </div>
  );
}
