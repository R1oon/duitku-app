import React from "react";
import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <div className="fixed bottom-6 right-1/2 translate-x-[180px] max-[440px]:right-5 max-[440px]:translate-x-0 z-40 pb-safe">
      <button
        type="button"
        onClick={onClick}
        aria-label="Tambah Transaksi Baru"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#14B8A6] text-[#0D0D0D] shadow-lg shadow-[#14B8A6]/25 hover:bg-[#0d9488] active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
}
