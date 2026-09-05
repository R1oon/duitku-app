import { createClient } from "@supabase/supabase-js";

function normalizeUrl(url) {
  if (!url) return "";
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

const url = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

console.log("------------------------------------------");
console.log("🔍 DUITKU - Verifikasi Integrasi Database (Fase 2)");
console.log("------------------------------------------");
console.log("Supabase URL:", url);

if (!url || !key) {
  console.error("❌ Environment variables belum lengkap!");
  process.exit(1);
}

const supabase = createClient(url, key);

async function runTests() {
  let createdId = null;

  try {
    // 1. Test Select Awal
    console.log("\n[1/4] Menguji query SELECT...");
    const { data: initialData, error: selectErr } = await supabase
      .from("transactions")
      .select("*")
      .limit(5);

    if (selectErr) throw selectErr;
    console.log(`✅ SELECT berhasil! Ditemukan ${initialData.length} transaksi yang ada.`);

    // 2. Test Insert
    console.log("\n[2/4] Menguji query INSERT...");
    const testItem = {
      item_name: "Test Verifikasi Fase 2",
      amount: 15000,
      note: "Data uji coba otomatis",
    };

    const { data: insertedData, error: insertErr } = await supabase
      .from("transactions")
      .insert(testItem)
      .select()
      .single();

    if (insertErr) throw insertErr;
    createdId = insertedData.id;
    console.log("✅ INSERT berhasil!");
    console.log("   ID:", insertedData.id);
    console.log("   Barang:", insertedData.item_name);
    console.log("   Nominal: Rp" + insertedData.amount.toLocaleString("id-ID"));
    console.log("   Waktu:", insertedData.created_at);

    // 3. Test Update
    console.log("\n[3/4] Menguji query UPDATE...");
    const { data: updatedData, error: updateErr } = await supabase
      .from("transactions")
      .update({ note: "Update berhasil diverifikasi" })
      .eq("id", createdId)
      .select()
      .single();

    if (updateErr) throw updateErr;
    console.log("✅ UPDATE berhasil! Note baru:", updatedData.note);

    // 4. Test Delete (Clean up)
    console.log("\n[4/4] Menguji query DELETE (membersihkan data uji coba)...");
    const { error: deleteErr } = await supabase
      .from("transactions")
      .delete()
      .eq("id", createdId);

    if (deleteErr) throw deleteErr;
    console.log("✅ DELETE berhasil! Data uji coba telah dihapus.");

    console.log("\n🎉 SELURUH PENGUJIAN FASE 2 BERHASIL 100%!");
    console.log("Tabel 'transactions', RLS anonymous, dan koneksi Supabase terhubung sempurna.");
  } catch (error) {
    console.error("\n❌ Terjadi kesalahan saat pengujian:", error.message || error);
    if (createdId) {
      // Pastikan cleanup jika terjadi error
      await supabase.from("transactions").delete().eq("id", createdId);
    }
    process.exit(1);
  }
}

runTests();
