"use client";

import React, { useState, useMemo } from "react";
import { Clock, Search, X } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { TimelineItem } from "./TimelineItem";
import { categorizeItem, CategoryName, CATEGORY_COLORS } from "@/lib/categories";

interface RealtimeTimelineProps {
  transactions: Transaction[];
  isLoading: boolean;
  recentIds: Set<string>;
}

const CATEGORIES: Array<"Semua" | CategoryName> = [
  "Semua",
  "Makanan",
  "Minuman",
  "Transport",
  "Belanja",
  "Lainnya",
];

export function RealtimeTimeline({
  transactions,
  isLoading,
  recentIds,
}: RealtimeTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<"Semua" | CategoryName>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchCat =
        selectedCategory === "Semua" || categorizeItem(tx.item_name) === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        tx.item_name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        Boolean(tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchCat && matchSearch;
    });
  }, [transactions, selectedCategory, searchQuery]);

  return (
    <section className="mt-7 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
            Timeline Hari Ini
          </h2>
          <span className="text-[10px] text-[#A1A1AA]/60">Terbaru &rarr; Terlama</span>
        </div>
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowSearch((prev) => !prev);
                if (showSearch) setSearchQuery("");
              }}
              aria-label="Cari transaksi"
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showSearch || searchQuery
                  ? "bg-[#14B8A6]/10 border-[#14B8A6]/40 text-[#14B8A6]"
                  : "bg-[#161616] border-[#262626] text-[#A1A1AA] hover:text-[#F5F5F5]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-xs font-mono-num text-[#A1A1AA]">
            {filteredTransactions.length}{filteredTransactions.length !== transactions.length ? `/${transactions.length}` : ""} Data
          </span>
        </div>
      </div>

      {/* Search Input Bar (Expandable) */}
      {showSearch && (
        <div className="mb-3 px-1 relative animate-in fade-in duration-150">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi hari ini..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#161616] border border-[#262626] text-xs text-[#F5F5F5] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#14B8A6] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#F5F5F5] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Category Filter Chips (if transactions > 0) */}
      {transactions.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-none px-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const color = cat === "Semua" ? "#14B8A6" : CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#262626] text-[#F5F5F5]"
                    : "bg-[#161616] text-[#A1A1AA] hover:text-[#F5F5F5] border-[#262626]"
                }`}
                style={
                  isSelected
                    ? { borderColor: color, color: color }
                    : undefined
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

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
                </div>
                <div className="h-5 w-24 bg-[#262626] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/40 my-auto">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-[#A1A1AA] mb-3.5">
            <Clock className="w-6 h-6 text-[#A1A1AA]" />
          </div>
          <p className="text-sm font-semibold text-[#F5F5F5]">
            Menunggu aktivitas dari Ari
          </p>
          <p className="text-xs text-[#A1A1AA] mt-1.5 max-w-[250px] leading-relaxed">
            Setiap catatan pengeluaran baru dari Ari akan langsung muncul di sini secara otomatis.
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-12 px-4 text-center border border-dashed border-[#262626] rounded-[20px] bg-[#161616]/20">
          <p className="text-xs text-[#A1A1AA]">
            Tidak ada transaksi yang cocok dengan filter atau kata kunci.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Semua");
              setSearchQuery("");
            }}
            className="mt-2 text-xs text-[#14B8A6] underline cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {filteredTransactions.map((item) => (
            <TimelineItem
              key={item.id}
              transaction={item}
              isRecent={recentIds.has(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
