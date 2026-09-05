import { Transaction } from "./supabase";

export type CategoryName = "Makanan" | "Minuman" | "Transport" | "Belanja" | "Lainnya";

export interface CategorySummary {
  name: CategoryName;
  value: number; // Total nominal
  count: number; // Jumlah transaksi
  color: string;
}

export const CATEGORY_COLORS: Record<CategoryName, string> = {
  Makanan: "#F59E0B",   // Amber
  Minuman: "#14B8A6",   // Teal (DUITKU accent)
  Transport: "#3B82F6", // Blue
  Belanja: "#EC4899",   // Pink
  Lainnya: "#9CA3AF",   // Gray
};

const KEYWORDS: Record<CategoryName, string[]> = {
  Makanan: [
    "makan", "nasi", "bakso", "mie", "ayam", "bebek", "sate", "martabak",
    "roti", "pizza", "burger", "ketoprak", "gado", "bubur", "sarapan",
    "lunch", "dinner", "snack", "cemilan", "batagor", "siomay", "soto",
    "lalapan", "pecel", "rendang", "gorengan", "cilok", "seblak", "tahu",
    "tempe", "warteg", "padang", "geprek", "katsu", "ramen"
  ],
  Minuman: [
    "minum", "kopi", "coffee", "cafe", "latte", "espresso", "cappuccino",
    "capuccino", "es", "teh", "tea", "jus", "juice", "aqua", "mineral",
    "minerale", "boba", "susu", "milk", "chatime", "janji jiwa", "kulo",
    "starbucks", "barista", "haus", "mixue", "kopken", "kenangan"
  ],
  Transport: [
    "bensin", "pertalite", "pertamax", "solar", "spbu", "gojek", "grab",
    "maxim", "ojol", "bus", "angkot", "kereta", "krl", "mrt", "lrt", "tj",
    "transjakarta", "parkir", "tol", "tambal", "helm", "goride", "go-ride",
    "gocar", "go-car", "grabike", "grabcar", "taxi", "taksi", "service", "oli"
  ],
  Belanja: [
    "belanja", "minimarket", "supermarket", "indomaret", "alfamart",
    "alfamidi", "superindo", "alfagift", "sabun", "shampoo", "odol",
    "pasta gigi", "deterjen", "tisu", "pulsa", "paket data", "kuota",
    "token", "pln", "listrik", "baju", "kaos", "celana", "sepatu", "sandal",
    "jaket", "skincare", "obat", "apotek", "toko", "shopee", "tokopedia", "tiktok"
  ],
  Lainnya: [],
};

/**
 * Mengelompokkan transaksi ke dalam kategori berdasarkan kata kunci nama barang
 */
export function categorizeItem(itemName: string): CategoryName {
  if (!itemName) return "Lainnya";

  const lower = itemName.toLowerCase().trim();

  // Cek kategori secara berurutan
  for (const category of ["Makanan", "Minuman", "Transport", "Belanja"] as CategoryName[]) {
    const matched = KEYWORDS[category].some((keyword) => {
      // Pencarian kata utuh atau substring
      return lower.includes(keyword);
    });

    if (matched) return category;
  }

  return "Lainnya";
}

/**
 * Menghitung agregasi pengeluaran per kategori dari daftar transaksi
 */
export function aggregateByCategory(transactions: Transaction[]): CategorySummary[] {
  const totals: Record<CategoryName, { value: number; count: number }> = {
    Makanan: { value: 0, count: 0 },
    Minuman: { value: 0, count: 0 },
    Transport: { value: 0, count: 0 },
    Belanja: { value: 0, count: 0 },
    Lainnya: { value: 0, count: 0 },
  };

  for (const item of transactions) {
    const category = categorizeItem(item.item_name);
    totals[category].value += item.amount || 0;
    totals[category].count += 1;
  }

  // Ubah ke array dan urutkan dari nilai tertinggi ke terendah
  const result: CategorySummary[] = (Object.keys(totals) as CategoryName[])
    .map((name) => ({
      name,
      value: totals[name].value,
      count: totals[name].count,
      color: CATEGORY_COLORS[name],
    }))
    .filter((cat) => cat.value > 0) // Hanya tampilkan kategori yang memiliki nilai
    .sort((a, b) => b.value - a.value);

  return result;
}
