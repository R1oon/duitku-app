"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategorySummary } from "@/lib/categories";
import { formatRupiah } from "@/lib/format";
import { PieChartIcon } from "lucide-react";

interface CategoryChartProps {
  categories: CategorySummary[];
  totalAmount: number;
}

export function CategoryChart({ categories, totalAmount }: CategoryChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Custom Tooltip Black Journal Theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategorySummary;
      const percentage = ((item.value / totalAmount) * 100).toFixed(1);

      return (
        <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626] shadow-xl text-xs font-sans">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-bold text-[#F5F5F5]">{item.name}</span>
          </div>
          <div className="font-mono-num font-semibold text-[#14B8A6]">
            {formatRupiah(item.value)}
          </div>
          <div className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono-num">
            {percentage}% ({item.count} transaksi)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-5 p-6 rounded-[20px] bg-[#161616] border border-[#262626]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Distribusi Pengeluaran
        </h3>
        <span className="text-[11px] text-[#9CA3AF]">{categories.length} Kategori</span>
      </div>

      {/* Donut Chart Container */}
      <div className="h-56 w-full relative flex items-center justify-center">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                stroke="#161616"
                strokeWidth={2}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-[#0D0D0D]/50 rounded-xl" />
        )}

        {/* Center Label inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">Total</span>
          <span className="text-xs font-bold font-mono-num text-[#14B8A6]">
            {formatRupiah(totalAmount)}
          </span>
        </div>
      </div>

      {/* Category Breakdown Legend */}
      <div className="mt-4 pt-4 border-t border-[#262626] space-y-2.5">
        {categories.map((cat) => {
          const percent = ((cat.value / totalAmount) * 100).toFixed(0);

          return (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[#F5F5F5] font-medium">{cat.name}</span>
                <span className="text-[10px] text-[#9CA3AF] font-mono-num">
                  ({cat.count})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#9CA3AF] font-mono-num">
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
