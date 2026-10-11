import { supabase, Transaction, TransactionInsert, TransactionUpdate } from "./supabase";

export type { Transaction, TransactionInsert, TransactionUpdate };

export interface DbResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Mengambil semua data transaksi terurut dari yang terbaru (created_at DESC)
 */
export async function getTransactions(limit?: number): Promise<DbResult<Transaction[]>> {
  try {
    let query = supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal mengambil data transaksi") };
  }
}

/**
 * Mengambil transaksi untuk hari ini (berdasarkan rentang awal hari s/d akhir hari lokal)
 */
export async function getTodayTransactions(): Promise<DbResult<Transaction[]>> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal mengambil transaksi hari ini") };
  }
}

/**
 * Mengambil transaksi berdasarkan bulan & tahun tertentu (untuk Rekap Bulanan)
 * @param year tahun (contoh: 2026)
 * @param month bulan 1-12 (1: Januari, 12: Desember)
 */
export async function getMonthlyTransactions(
  year: number,
  month: number
): Promise<DbResult<Transaction[]>> {
  try {
    // Awal bulan (index month di JS Date adalah 0-11)
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    // Akhir bulan (tanggal 0 dari bulan berikutnya adalah hari terakhir bulan ini)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("created_at", startOfMonth.toISOString())
      .lte("created_at", endOfMonth.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal mengambil rekap transaksi bulanan") };
  }
}

/**
 * Menambahkan transaksi baru
 */
export async function createTransaction(
  payload: TransactionInsert
): Promise<DbResult<Transaction>> {
  try {
    if (!payload.item_name || payload.item_name.trim() === "") {
      throw new Error("Nama barang tidak boleh kosong");
    }
    if (!payload.amount || payload.amount <= 0) {
      throw new Error("Nominal harus lebih besar dari 0");
    }

    const newRecord: TransactionInsert = {
      item_name: payload.item_name.trim(),
      amount: Math.round(payload.amount),
      note: payload.note?.trim() || null,
      created_at: payload.created_at || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(newRecord)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal menyimpan transaksi") };
  }
}

/**
 * Memperbarui data transaksi berdasarkan id
 */
export async function updateTransaction(
  id: string,
  payload: TransactionUpdate
): Promise<DbResult<Transaction>> {
  try {
    if (!id) {
      throw new Error("ID transaksi diperlukan untuk update");
    }

    const updates: TransactionUpdate = {};
    if (payload.item_name !== undefined) {
      if (!payload.item_name.trim()) throw new Error("Nama barang tidak boleh kosong");
      updates.item_name = payload.item_name.trim();
    }
    if (payload.amount !== undefined) {
      if (payload.amount <= 0) throw new Error("Nominal harus lebih besar dari 0");
      updates.amount = Math.round(payload.amount);
    }
    if (payload.note !== undefined) {
      updates.note = payload.note?.trim() || null;
    }

    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal memperbarui transaksi") };
  }
}

/**
 * Menghapus transaksi berdasarkan id
 */
export async function deleteTransaction(id: string): Promise<DbResult<boolean>> {
  try {
    if (!id) {
      throw new Error("ID transaksi diperlukan untuk penghapusan");
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { data: true, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || "Gagal menghapus transaksi") };
  }
}
