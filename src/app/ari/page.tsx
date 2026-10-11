"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { getTodayTransactions, getMonthlyTransactions } from "@/lib/transactions";
import { subscribeToTransactions } from "@/lib/realtime";
import { ViewerHeader } from "@/components/viewer/ViewerHeader";
import { BigTotalDisplay } from "@/components/viewer/BigTotalDisplay";
import { RealtimeTimeline } from "@/components/viewer/RealtimeTimeline";
import { MonthlyRecapView } from "@/components/viewer/MonthlyRecapView";
import { PdfDocument } from "@/components/pdf/PdfDocument";
import { ExportPdfModal } from "@/components/pdf/ExportPdfModal";
import { generate3PagePdf } from "@/lib/pdf";
import { formatMonthYear } from "@/lib/format";

export default function ViewerPage() {
  // Transaksi Hari Ini (Realtime)
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());

  // Transaksi Rekap Bulanan
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(new Date());
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(true);

  // 1. Fetch Transaksi Hari Ini
  const loadTodayData = useCallback(async () => {
    setIsLoadingToday(true);
    const { data, error } = await getTodayTransactions();

    if (error) {
      console.error("Gagal mengambil data transaksi hari ini:", error);
    } else {
      setTodayTransactions(data || []);
    }
    setIsLoadingToday(false);
  }, []);

  // 2. Fetch Transaksi Bulanan
  const loadMonthlyData = useCallback(async (targetDate: Date) => {
    setIsLoadingMonthly(true);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1; // 1-12

    const { data, error } = await getMonthlyTransactions(year, month);
    if (error) {
      console.error("Gagal mengambil data bulanan:", error);
    } else {
      setMonthlyTransactions(data || []);
    }
    setIsLoadingMonthly(false);
  }, []);

  // Inisialisasi awal
  useEffect(() => {
    loadTodayData();
    loadMonthlyData(selectedMonthDate);

    // Berlangganan Realtime Supabase
    const unsubscribe = subscribeToTransactions(
      (payload) => {
        if (payload.eventType === "INSERT") {
          const newRecord = payload.new;
          const createdDate = new Date(newRecord.created_at);
          const now = new Date();

          // Cek apakah data ini untuk hari ini
          const isToday =
            createdDate.getDate() === now.getDate() &&
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear();

          if (isToday) {
            setTodayTransactions((prev) => {
              if (prev.some((t) => t.id === newRecord.id)) return prev;
              return [newRecord, ...prev];
            });

            // Highlight visual untuk item baru
            setRecentIds((prev) => new Set(prev).add(newRecord.id));
            setTimeout(() => {
              setRecentIds((prev) => {
                const next = new Set(prev);
                next.delete(newRecord.id);
                return next;
              });
            }, 6000);
          }

          // Cek apakah data baru ini masuk ke bulan yang sedang dipilih
          setSelectedMonthDate((currentSelected) => {
            if (
              createdDate.getMonth() === currentSelected.getMonth() &&
              createdDate.getFullYear() === currentSelected.getFullYear()
            ) {
              setMonthlyTransactions((prev) => {
                if (prev.some((t) => t.id === newRecord.id)) return prev;
                return [newRecord, ...prev];
              });
            }
            return currentSelected;
          });
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new;
          setTodayTransactions((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
          setMonthlyTransactions((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
        } else if (payload.eventType === "DELETE") {
          const deletedId = payload.old.id;
          setTodayTransactions((prev) => prev.filter((t) => t.id !== deletedId));
          setMonthlyTransactions((prev) => prev.filter((t) => t.id !== deletedId));
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
  }, [loadTodayData, loadMonthlyData]);

  // Handler Navigasi Bulan Sebelumnya
  const handlePrevMonth = () => {
    const prev = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth() - 1,
      1
    );
    setSelectedMonthDate(prev);
    loadMonthlyData(prev);
  };

  // Handler Navigasi Bulan Berikutnya
  const handleNextMonth = () => {
    const now = new Date();
    const next = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth() + 1,
      1
    );

    // Batasi agar tidak melebihi bulan berjalan saat ini
    if (next <= now || (next.getFullYear() === now.getFullYear() && next.getMonth() === now.getMonth())) {
      setSelectedMonthDate(next);
      loadMonthlyData(next);
    }
  };

  // Cek apakah bisa navigasi ke bulan selanjutnya
  const canNextMonth = useMemo(() => {
    const now = new Date();
    return (
      selectedMonthDate.getFullYear() < now.getFullYear() ||
      selectedMonthDate.getMonth() < now.getMonth()
    );
  }, [selectedMonthDate]);

  // Hitung total pengeluaran hari ini secara realtime
  const todayTotal = useMemo(() => {
    return todayTransactions.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [todayTransactions]);

  // State untuk proses pembuatan PDF
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfStatusText, setPdfStatusText] = useState("");
  const [isPdfComplete, setIsPdfComplete] = useState(false);

  // Handler ekspor PDF 3 halaman A4
  const handleDownloadPdf = async () => {
    if (monthlyTransactions.length === 0) {
      alert("Belum ada data transaksi di bulan ini untuk diekspor ke PDF.");
      return;
    }

    setIsExportingPdf(true);
    setIsPdfComplete(false);
    setPdfStatusText("Menyiapkan dokumen A4...");

    const monthStr = formatMonthYear(selectedMonthDate).replace(/\s+/g, "_");
    const fileName = `DUITKU_Laporan_Pengeluaran_${monthStr}_Ari.pdf`;

    try {
      await generate3PagePdf({
        fileName,
        onProgress: (status) => setPdfStatusText(status),
      });

      setIsPdfComplete(true);
      setPdfStatusText("Dokumen PDF berhasil disimpan ke perangkat!");
      setTimeout(() => {
        setIsExportingPdf(false);
      }, 1600);
    } catch (err: any) {
      alert("Gagal membuat PDF: " + (err.message || "Terjadi kesalahan"));
      setIsExportingPdf(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 px-4 py-6 pb-safe">
      {/* 1. Header Viewer dengan LIVE Badge */}
      <ViewerHeader isLive={isLive} />

      {/* 2. Big Total Display (Total Hari Ini) */}
      <BigTotalDisplay totalAmount={todayTotal} />

      {/* 3. Realtime Timeline Hari Ini */}
      <RealtimeTimeline
        transactions={todayTransactions}
        isLoading={isLoadingToday}
        recentIds={recentIds}
      />

      {/* 4. MonthlyRecapView (Summary, Recharts Donut, Monthly Table) */}
      <MonthlyRecapView
        currentDate={selectedMonthDate}
        transactions={monthlyTransactions}
        isLoading={isLoadingMonthly}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        canNextMonth={canNextMonth}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Template Hidden Document untuk Render jsPDF & html2canvas (3 Halaman A4) */}
      <PdfDocument
        currentDate={selectedMonthDate}
        transactions={monthlyTransactions}
        ownerName="Ari"
      />

      {/* Modal Status Proses Download PDF */}
      <ExportPdfModal
        isOpen={isExportingPdf}
        statusText={pdfStatusText}
        isComplete={isPdfComplete}
      />

      {/* Footer Shortcut ke Halaman Editor */}
      <footer className="mt-12 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#9CA3AF] pb-4">
        <Link
          href="/editor"
          className="inline-flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#F5F5F5] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ke Halaman Editor</span>
        </Link>
        <span className="text-[11px] text-[#9CA3AF]/60">DUITKU Realtime & Analytics</span>
      </footer>
    </main>
  );
}
