"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { getTodayTransactions } from "@/lib/transactions";
import { subscribeToTransactions } from "@/lib/realtime";
import { ViewerHeader } from "@/components/viewer/ViewerHeader";
import { BigTotalDisplay } from "@/components/viewer/BigTotalDisplay";
import { RealtimeTimeline } from "@/components/viewer/RealtimeTimeline";

export default function ViewerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());

  // Fetch initial data transaksi hari ini
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getTodayTransactions();

    if (error) {
      console.error("Gagal mengambil data viewer:", error);
    } else {
      setTransactions(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();

    // Berlangganan Realtime Supabase
    const unsubscribe = subscribeToTransactions(
      (payload) => {
        if (payload.eventType === "INSERT") {
          const newRecord = payload.new;

          // Verifikasi apakah transaksi baru termasuk hari ini
          const createdDate = new Date(newRecord.created_at);
          const now = new Date();
          const isToday =
            createdDate.getDate() === now.getDate() &&
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear();

          if (isToday) {
            setTransactions((prev) => {
              if (prev.some((t) => t.id === newRecord.id)) return prev;
              return [newRecord, ...prev];
            });

            // Tandai sebagai item baru untuk highlight visual
            setRecentIds((prev) => new Set(prev).add(newRecord.id));
            setTimeout(() => {
              setRecentIds((prev) => {
                const next = new Set(prev);
                next.delete(newRecord.id);
                return next;
              });
            }, 6000);
          }
        } else if (payload.eventType === "UPDATE") {
          const updatedRecord = payload.new;
          setTransactions((prev) =>
            prev.map((item) =>
              item.id === updatedRecord.id ? updatedRecord : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          const deletedId = payload.old.id;
          setTransactions((prev) => prev.filter((item) => item.id !== deletedId));
        }
      },
      (status) => {
        setIsLive(status === "SUBSCRIBED");
      },
      "viewer-ari"
    );

    return () => {
      unsubscribe();
    };
  }, [loadInitialData]);

  // Hitung total hari ini secara realtime
  const todayTotal = useMemo(() => {
    return transactions.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [transactions]);

  return (
    <main className="flex flex-col flex-1 px-4 py-6 pb-safe">
      {/* Header Viewer dengan LIVE Badge */}
      <ViewerHeader isLive={isLive} />

      {/* Big Total Display (Tampilan Total Terpusat) */}
      <BigTotalDisplay totalAmount={todayTotal} />

      {/* Timeline Realtime (Terbaru -> Terlama) */}
      <RealtimeTimeline
        transactions={transactions}
        isLoading={isLoading}
        recentIds={recentIds}
      />

      {/* Navigation Shortcut ke Halaman Editor */}
      <footer className="mt-8 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#9CA3AF] pb-4">
        <Link
          href="/editor"
          className="inline-flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#F5F5F5] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ke Halaman Editor</span>
        </Link>
        <span className="text-[11px] text-[#9CA3AF]/60">Realtime Active</span>
      </footer>
    </main>
  );
}
