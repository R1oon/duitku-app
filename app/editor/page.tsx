"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import {
  getTodayTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/transactions";
import { subscribeToTransactions } from "@/lib/realtime";
import { Header } from "@/components/editor/Header";
import { SummaryCard } from "@/components/editor/SummaryCard";
import { TransactionList } from "@/components/editor/TransactionList";
import { FloatingAddButton } from "@/components/editor/FloatingAddButton";
import { TransactionModal } from "@/components/editor/TransactionModal";
import { DeleteConfirmModal } from "@/components/editor/DeleteConfirmModal";

export default function EditorPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"connected" | "connecting" | "error">("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; itemName: string } | null>(null);

  // Fetch initial data
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setStatus("connecting");
    const { data, error } = await getTodayTransactions();

    if (error) {
      console.error("Error loading today transactions:", error);
      setStatus("error");
    } else {
      setTransactions(data || []);
      setStatus("connected");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();

    // Subscribe to realtime updates for synchronization
    const unsubscribe = subscribeToTransactions((payload) => {
      if (payload.eventType === "INSERT") {
        const newRecord = payload.new;
        // Pastikan hanya dimasukkan jika belum ada di list (misal: dimasukkan dari sesi lain atau background)
        setTransactions((prev) => {
          const exists = prev.some(
            (item) => item.id === newRecord.id || (item.id.startsWith("temp-") && item.item_name === newRecord.item_name && item.amount === newRecord.amount)
          );
          if (exists) {
            // Update item yang ber-ID temp dengan id sebenarnya
            return prev.map((item) =>
              item.id.startsWith("temp-") && item.item_name === newRecord.item_name && item.amount === newRecord.amount
                ? newRecord
                : item
            );
          }
          return [newRecord, ...prev];
        });
      } else if (payload.eventType === "UPDATE") {
        const updated = payload.new;
        setTransactions((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else if (payload.eventType === "DELETE") {
        const deletedId = payload.old.id;
        setTransactions((prev) => prev.filter((item) => item.id !== deletedId));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadTransactions]);

  // Hitung total hari ini secara instan dari state lokal
  const todayTotal = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [transactions]);

  // Handler Buka Modal Tambah
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleOpenEditModal = (item: Transaction) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handler Tutup Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Handler Simpan Transaksi dengan OPTIMISTIC UI
  const handleSaveTransaction = async (formData: {
    item_name: string;
    amount: number;
    note?: string;
  }) => {
    setErrorMessage(null);

    if (editingItem) {
      // === ALUR OPTIMISTIC UPDATE ===
      const previousState = [...transactions];
      const optimisticUpdatedItem: Transaction = {
        ...editingItem,
        item_name: formData.item_name,
        amount: formData.amount,
        note: formData.note || null,
      };

      // 1. Tutup modal seketika
      handleCloseModal();

      // 2. Perbarui state lokal secara instan (0ms delay)
      setTransactions((prev) =>
        prev.map((item) => (item.id === editingItem.id ? optimisticUpdatedItem : item))
      );

      // 3. Kirim request update ke database di latar belakang
      const { error } = await updateTransaction(editingItem.id, {
        item_name: formData.item_name,
        amount: formData.amount,
        note: formData.note,
      });

      // 4. Jika gagal, rollback ke data sebelumnya
      if (error) {
        setTransactions(previousState);
        setErrorMessage("Gagal memperbarui catatan. Perubahan dibatalkan.");
      }
    } else {
      // === ALUR OPTIMISTIC INSERT ===
      const tempId = `temp-${Date.now()}`;
      const optimisticNewItem: Transaction = {
        id: tempId,
        item_name: formData.item_name,
        amount: formData.amount,
        note: formData.note || null,
        created_at: new Date().toISOString(),
      };

      // 1. Tutup modal seketika
      handleCloseModal();

      // 2. Tambahkan ke daftar teratas secara instan (0ms delay)
      setTransactions((prev) => [optimisticNewItem, ...prev]);

      // 3. Kirim request insert ke Supabase di latar belakang
      const { data: createdRecord, error } = await createTransaction({
        item_name: formData.item_name,
        amount: formData.amount,
        note: formData.note,
        created_at: optimisticNewItem.created_at,
      });

      // 4. Jika gagal, rollback. Jika berhasil, gantikan tempId dengan UUID riil dari database.
      if (error) {
        setTransactions((prev) => prev.filter((item) => item.id !== tempId));
        setErrorMessage("Gagal menyimpan pengeluaran ke database. Silakan coba lagi.");
      } else if (createdRecord) {
        setTransactions((prev) =>
          prev.map((item) => (item.id === tempId ? createdRecord : item))
        );
      }
    }
  };

  // Handler Hapus dengan Konfirmasi & OPTIMISTIC UI
  const handleOpenDelete = (id: string, itemName: string) => {
    setDeleteTarget({ id, itemName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.id;
    const previousState = [...transactions];

    // 1. Tutup dialog konfirmasi seketika
    setDeleteTarget(null);

    // 2. Hapus dari state lokal seketika (0ms delay)
    setTransactions((prev) => prev.filter((item) => item.id !== targetId));

    // 3. Kirim delete ke Supabase di latar belakang
    const { error } = await deleteTransaction(targetId);

    // 4. Rollback jika request gagal
    if (error) {
      setTransactions(previousState);
      setErrorMessage("Gagal menghapus pengeluaran. Catatan dikembalikan.");
    }
  };

  return (
    <main className="flex flex-col flex-1 px-4 py-6 pb-safe relative">
      {/* Header dengan status koneksi Supabase */}
      <Header status={status} />

      {/* Banner Notifikasi Error jika rollback terjadi */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-[20px] bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-center justify-between gap-3 text-xs text-[#DC2626] animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[#DC2626] hover:underline font-bold px-1 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Summary Card (Total Hari Ini) */}
      <SummaryCard totalAmount={todayTotal} />

      {/* List Transaksi Hari Ini */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDelete}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Floating Action Button (+) */}
      <FloatingAddButton onClick={handleOpenAddModal} />

      {/* Modal Tambah / Edit Transaksi */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        initialData={editingItem}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.itemName || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Navigasi Cepat Footer */}
      <footer className="mt-8 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#9CA3AF] pb-4">
        <span>Editor Jurnal</span>
        <Link
          href="/ari"
          className="inline-flex items-center gap-1 text-[#14B8A6] hover:text-[#2dd4bf] font-medium transition-colors"
        >
          Lihat Viewer (/ari)
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </main>
  );
}
