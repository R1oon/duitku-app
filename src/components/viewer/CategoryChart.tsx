"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CategorySummary } from "@/lib/categories";
import { formatRupiah } from "@/lib/format";
import { PieChartIcon } from "lucide-react";

interface CategoryChartProps {
  categories: CategorySummary[];
  totalAmount: number;
}

const emptySubscribe = () => () => {};

export function CategoryChart({ categories, totalAmount }: CategoryChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (categories.length === 0 || totalAmount === 0) {
    return (
      <div className="mt-5 p-8 rounded-[20px] bg-[#161616] border border-[#262626] text-center">
        <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center mx-auto text-[#9CA3AF] mb-3">
          <PieChartIcon className="w-5 h-5 text-[#9CA3AF]" />
        </div>
        <p className="text-sm font-semibold text-[#F5F5F5]">Belum ada data grafik</p>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Kategori pengeluaran akan otomatis terisi saat transaksi tercatat di bulan ini.
        </p>
      </div>
    );
  }

  const activeCategory =
    activeIndex !== null && categories[activeIndex] ? categories[activeIndex] : null;

  return (
    <div className="mt-5 p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
            Distribusi Pengeluaran
          </h3>
          <p className="text-[10px] text-[#A1A1AA]/60 mt-0.5">
            Sentuh diagram atau kategori di bawah untuk melihat rincian
          </p>
        </div>
        <span className="text-[11px] font-mono-num text-[#14B8A6] px-2.5 py-0.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20">
          {categories.length} Kategori
        </span>
      </div>

      {/* Donut Chart Container */}
      <div className="h-60 w-full relative flex items-center justify-center">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={85}
                paddingAngle={4}
                stroke="#161616"
                strokeWidth={3}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, index) => {
                  setActiveIndex((prev) => (prev === index ? null : index));
                }}
              >
                {categories.map((entry, index) => {
                  const isCurrentActive = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer outline-none transition-all duration-200"
                      style={{
                        opacity: activeIndex !== null && !isCurrentActive ? 0.35 : 1,
                      }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-[#0D0D0D]/50 rounded-xl" />
        )}

        {/* Center Display Hub (Bebas Bentrok & Anti Tabrakan) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center select-none transition-all duration-200">
          {activeCategory ? (
            <div className="animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
              <span
                className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5"
                style={{ color: activeCategory.color }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: activeCategory.color }}
                />
                {activeCategory.name}
              </span>
              <span className="text-base font-extrabold font-mono-num text-[#F5F5F5] mt-1 tracking-tight">
                {formatRupiah(activeCategory.value)}
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono-num mt-0.5">
                {((activeCategory.value / totalAmount) * 100).toFixed(1)}% • {activeCategory.count} trx
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">
                Total Bulan Ini
              </span>
              <span className="text-base font-black font-mono-num text-[#14B8A6] mt-0.5 tracking-tight">
                {formatRupiah(totalAmount)}
              </span>
              <span className="text-[10px] text-[#A1A1AA]/60 font-mono-num mt-0.5">
                Sentuh untuk detail
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Legend (Interaktif: Tap/Hover untuk filter visual) */}
      <div className="mt-3 pt-4 border-t border-[#262626] space-y-1.5">
        {categories.map((cat, idx) => {
          const percent = ((cat.value / totalAmount) * 100).toFixed(0);
          const isSelected = activeIndex === idx;

          return (
            <div
              key={cat.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex((prev) => (prev === idx ? null : idx))}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#262626] scale-[1.01]"
                  : "hover:bg-[#1f1f1f]/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: cat.color,
                    transform: isSelected ? "scale(1.3)" : "scale(1)",
                  }}
                />
                <span
                  className={`font-medium transition-colors ${
                    isSelected ? "text-[#F5F5F5] font-semibold" : "text-[#D4D4D8]"
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#A1A1AA] font-mono-num">
                  ({cat.count})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#A1A1AA] font-mono-num">
                  {percent}%
                </span>
                <span className="font-bold text-[#F5F5F5] font-mono-num">
                  {formatRupiah(cat.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
