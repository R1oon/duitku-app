import React from "react";
import { Transaction } from "@/lib/supabase";
import {
  formatRupiah,
  formatMonthYear,
  formatHeaderDate,
  formatShortDate,
  formatTime,
} from "@/lib/format";
import {
  categorizeItem,
  aggregateByCategory,
  CATEGORY_COLORS,
} from "@/lib/categories";

interface PdfDocumentProps {
  currentDate: Date;
  transactions: Transaction[];
  ownerName?: string;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  ({ currentDate, transactions, ownerName = "Ari" }, ref) => {
    const monthName = formatMonthYear(currentDate);
    const printedDate = formatHeaderDate(new Date());

    const totalAmount = transactions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    // Hitung metrik eksekutif
    const totalTransactions = transactions.length;
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const averagePerDay = Math.round(totalAmount / (daysInMonth || 30));
    const maxTransaction =
      transactions.length > 0
        ? Math.max(...transactions.map((t) => t.amount || 0))
        : 0;

    // Agregasi kategori & persentase
    const categories = aggregateByCategory(transactions);
    const topCategory = categories.length > 0 ? categories[0] : null;

    // Nomor Dokumen Formal
    const yearMonth = `${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const docNumber = `DK/${yearMonth}/${ownerName.toUpperCase()}`;

    // Smart Dynamic Pagination
    const pages: Transaction[][] = [];
    if (transactions.length <= 13) {
      pages.push(transactions);
    } else {
      // Halaman 1: 16 baris
      pages.push(transactions.slice(0, 16));
      let currentIdx = 16;
      while (currentIdx < transactions.length) {
        const remaining = transactions.length - currentIdx;
        if (remaining <= 20) {
          pages.push(transactions.slice(currentIdx));
          break;
        } else {
          pages.push(transactions.slice(currentIdx, currentIdx + 25));
          currentIdx += 25;
        }
      }
    }

    const totalPages = pages.length;
    const fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

    return (
      <div
        ref={ref}
        id="pdf-document-container"
        style={{
          width: "794px",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          fontFamily,
        }}
      >
        {pages.map((pageTransactions, pageIdx) => {
          const pageNumber = pageIdx + 1;
          const isFirstPage = pageNumber === 1;
          const isLastPage = pageNumber === totalPages;

          let startRowNumber = 1;
          for (let p = 0; p < pageIdx; p++) {
            startRowNumber += pages[p].length;
          }

          return (
            <div
              key={`pdf-page-${pageNumber}`}
              id={`pdf-page-${pageNumber}`}
              className="pdf-report-page"
              style={{
                width: "794px",
                height: "1123px",
                padding: "38px 46px",
                boxSizing: "border-box",
                backgroundColor: "#FFFFFF",
                color: "#0F172A",
                fontFamily,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                {/* ===================================================
                    HEADER HALAMAN 1 (LENGKAP) VS HALAMAN LANJUTAN
                    =================================================== */}
                {isFirstPage ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "14px",
                      borderBottom: "2px solid #0F172A",
                      marginBottom: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#0F172A",
                            color: "#FFFFFF",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            lineHeight: "1",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#14B8A6",
                            }}
                          />
                          DUITKU
                        </div>
                        <span
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            color: "#64748B",
                            textTransform: "uppercase",
                          }}
                        >
                          FINANCIAL REPORTING SYSTEM
                        </span>
                      </div>
                      <h1
                        style={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "#0F172A",
                          margin: "0 0 3px 0",
                          letterSpacing: "-0.5px",
                          lineHeight: "1.2",
                        }}
                      >
                        Laporan Pengeluaran Bulanan
                      </h1>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "10.5px",
                          color: "#64748B",
                          lineHeight: "1.2",
                        }}
                      >
                        Jurnal pengeluaran personal dan transparansi keuangan keluarga
                      </p>
                    </div>

                    {/* Metadata Box Kanan Atas */}
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1.5px solid #CBD5E1",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        textAlign: "right",
                        minWidth: "175px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          color: "#64748B",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          lineHeight: "1.2",
                        }}
                      >
                        NO. DOKUMEN:{" "}
                        <span style={{ color: "#0F172A", fontFamily: "monospace" }}>
                          {docNumber}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#334155",
                          marginTop: "3px",
                          lineHeight: "1.2",
                        }}
                      >
                        <strong>Periode:</strong> {monthName} • <strong>Pemilik:</strong> {ownerName}
                      </div>
                      <div
                        style={{
                          fontSize: "9.5px",
                          color: "#059669",
                          fontWeight: 800,
                          marginTop: "3px",
                          lineHeight: "1.2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "4px",
                        }}
                      >
                        <span>✓</span> RESMI & TERVERIFIKASI
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Header Ringkas untuk Halaman Lanjutan */
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "10px",
                      borderBottom: "1.5px solid #0F172A",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: "#0F172A",
                        }}
                      >
                        Laporan Pengeluaran Bulanan — {monthName} (Lanjutan)
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748B",
                        }}
                      >
                        • Pemilik: {ownerName}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#64748B",
                        fontFamily: "monospace",
                      }}
                    >
                      {docNumber}
                    </div>
                  </div>
                )}

                {/* ===================================================
                    KPI CARDS & CATEGORY BAR (HANYA HALAMAN 1)
                    =================================================== */}
                {isFirstPage && (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.3fr 1fr 1fr",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      {/* Card 1: Total Pengeluaran */}
                      <div
                        style={{
                          backgroundColor: "#F0FDF4",
                          border: "1.5px solid #059669",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          height: "78px",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 800,
                            color: "#059669",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            lineHeight: "1",
                          }}
                        >
                          TOTAL PENGELUARAN BULANAN
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: 900,
                            color: "#065F46",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: "1.1",
                          }}
                        >
                          {formatRupiah(totalAmount)}
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#047857",
                            lineHeight: "1",
                          }}
                        >
                          Akumulasi Seluruh Kategori
                        </div>
                      </div>

                      {/* Card 2: Volume & Rata-rata */}
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #CBD5E1",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          height: "78px",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            lineHeight: "1",
                          }}
                        >
                          AKTIVITAS PENGELUARAN
                        </div>
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: 800,
                            color: "#0F172A",
                            lineHeight: "1.1",
                          }}
                        >
                          {totalTransactions}{" "}
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              color: "#64748B",
                            }}
                          >
                            Transaksi
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#64748B",
                            lineHeight: "1",
                          }}
                        >
                          Rata-rata: {formatRupiah(averagePerDay)} / hari
                        </div>
                      </div>

                      {/* Card 3: Kategori Dominan */}
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #CBD5E1",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          height: "78px",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            lineHeight: "1",
                          }}
                        >
                          KATEGORI DOMINAN
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#0F172A",
                            lineHeight: "1.1",
                          }}
                        >
                          {topCategory ? topCategory.name : "-"}
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#64748B",
                            lineHeight: "1",
                          }}
                        >
                          Puncak: {formatRupiah(maxTransaction)}
                        </div>
                      </div>
                    </div>

                    {/* Segmented Progress Bar */}
                    {categories.length > 0 && (
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #CBD5E1",
                          borderRadius: "10px",
                          padding: "9px 12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "9.5px",
                              fontWeight: 800,
                              color: "#334155",
                              textTransform: "uppercase",
                              letterSpacing: "0.6px",
                            }}
                          >
                            Proporsi Pengeluaran Kategori
                          </span>
                          <span style={{ fontSize: "9px", color: "#64748B" }}>
                            {categories.length} Kategori
                          </span>
                        </div>

                        {/* Bar Horizontal */}
                        <div
                          style={{
                            height: "8px",
                            borderRadius: "4px",
                            overflow: "hidden",
                            display: "flex",
                            backgroundColor: "#E2E8F0",
                            marginBottom: "7px",
                          }}
                        >
                          {categories.map((cat) => {
                            const percent =
                              totalAmount > 0
                                ? (cat.value / totalAmount) * 100
                                : 0;
                            return (
                              <div
                                key={cat.name}
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: cat.color,
                                  height: "100%",
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Legend Badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          {categories.map((cat) => {
                            const percent =
                              totalAmount > 0
                                ? (
                                    (cat.value / totalAmount) *
                                    100
                                  ).toFixed(0)
                                : "0";
                            return (
                              <div
                                key={cat.name}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  fontSize: "9.5px",
                                  lineHeight: "1",
                                }}
                              >
                                <span
                                  style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    backgroundColor: cat.color,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: "#0F172A",
                                  }}
                                >
                                  {cat.name}
                                </span>
                                <span
                                  style={{
                                    color: "#64748B",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {percent}% ({formatRupiah(cat.value)})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ===================================================
                    TABEL TRANSAKSI (VERTICALLY CENTERED & CRISP)
                    =================================================== */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "#0F172A",
                      }}
                    >
                      Rincian Catatan Transaksi
                    </span>
                    <span style={{ fontSize: "9.5px", color: "#64748B" }}>
                      Halaman {pageNumber} (Baris {startRowNumber}–
                      {startRowNumber + pageTransactions.length - 1} dari{" "}
                      {transactions.length})
                    </span>
                  </div>

                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "10px",
                      border: "1.5px solid #0F172A",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#0F172A",
                          color: "#FFFFFF",
                        }}
                      >
                        <th
                          style={{
                            padding: "8px 6px",
                            textAlign: "center",
                            width: "36px",
                            fontWeight: 700,
                            borderRight: "1px solid #334155",
                            verticalAlign: "middle",
                            lineHeight: "1.2",
                          }}
                        >
                          No
                        </th>
                        <th
                          style={{
                            padding: "8px 8px",
                            textAlign: "left",
                            width: "110px",
                            fontWeight: 700,
                            borderRight: "1px solid #334155",
                            verticalAlign: "middle",
                            lineHeight: "1.2",
                          }}
                        >
                          Waktu
                        </th>
                        <th
                          style={{
                            padding: "8px 8px",
                            textAlign: "center",
                            width: "85px",
                            fontWeight: 700,
                            borderRight: "1px solid #334155",
                            verticalAlign: "middle",
                            lineHeight: "1.2",
                          }}
                        >
                          Kategori
                        </th>
                        <th
                          style={{
                            padding: "8px 10px",
                            textAlign: "left",
                            fontWeight: 700,
                            borderRight: "1px solid #334155",
                            verticalAlign: "middle",
                            lineHeight: "1.2",
                          }}
                        >
                          Nama Barang / Catatan
                        </th>
                        <th
                          style={{
                            padding: "8px 10px",
                            textAlign: "right",
                            width: "105px",
                            fontWeight: 700,
                            verticalAlign: "middle",
                            lineHeight: "1.2",
                          }}
                        >
                          Nominal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageTransactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#64748B",
                              fontStyle: "italic",
                              verticalAlign: "middle",
                            }}
                          >
                            Tidak ada transaksi untuk periode ini.
                          </td>
                        </tr>
                      ) : (
                        pageTransactions.map((tx, idx) => {
                          const category = categorizeItem(tx.item_name);
                          const catColor = CATEGORY_COLORS[category];
                          const rowNum = startRowNumber + idx;

                          return (
                            <tr
                              key={tx.id}
                              style={{
                                backgroundColor:
                                  idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                                borderBottom: "1px solid #CBD5E1",
                                height: "30px",
                              }}
                            >
                              <td
                                style={{
                                  padding: "5px 6px",
                                  textAlign: "center",
                                  color: "#64748B",
                                  borderRight: "1px solid #E2E8F0",
                                  verticalAlign: "middle",
                                  lineHeight: "1.2",
                                }}
                              >
                                {rowNum}
                              </td>
                              <td
                                style={{
                                  padding: "5px 8px",
                                  color: "#334155",
                                  whiteSpace: "nowrap",
                                  borderRight: "1px solid #E2E8F0",
                                  verticalAlign: "middle",
                                  lineHeight: "1.2",
                                }}
                              >
                                <span style={{ fontWeight: 600, color: "#1E293B" }}>
                                  {formatShortDate(tx.created_at)}
                                </span>{" "}
                                <span
                                  style={{
                                    fontSize: "9px",
                                    color: "#64748B",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {formatTime(tx.created_at)}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "5px 8px",
                                  textAlign: "center",
                                  borderRight: "1px solid #E2E8F0",
                                  verticalAlign: "middle",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "19px",
                                    padding: "0 8px",
                                    borderRadius: "4px",
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    lineHeight: "1",
                                    color: catColor,
                                    backgroundColor: `${catColor}18`,
                                    border: `1px solid ${catColor}45`,
                                    verticalAlign: "middle",
                                    boxSizing: "border-box",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {category}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "5px 10px",
                                  color: "#0F172A",
                                  borderRight: "1px solid #E2E8F0",
                                  verticalAlign: "middle",
                                  lineHeight: "1.3",
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>
                                  {tx.item_name}
                                </span>
                                {tx.note && (
                                  <span
                                    style={{
                                      color: "#64748B",
                                      fontSize: "9px",
                                      fontStyle: "italic",
                                      marginLeft: "6px",
                                    }}
                                  >
                                    ({tx.note})
                                  </span>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "5px 10px",
                                  textAlign: "right",
                                  fontWeight: 800,
                                  color: "#0F172A",
                                  fontVariantNumeric: "tabular-nums",
                                  verticalAlign: "middle",
                                  lineHeight: "1.2",
                                }}
                              >
                                {formatRupiah(tx.amount)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Penanda bersambung jika bukan halaman terakhir */}
                  {!isLastPage && (
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "9.5px",
                        fontWeight: 600,
                        color: "#64748B",
                        fontStyle: "italic",
                        marginTop: "8px",
                      }}
                    >
                      * Bersambung ke halaman {pageNumber + 1}...
                    </div>
                  )}
                </div>

                {/* ===================================================
                    GRAND TOTAL BOX & SIGNATURES (HANYA HALAMAN TERAKHIR)
                    =================================================== */}
                {isLastPage && (
                  <div style={{ marginTop: "14px" }}>
                    {/* Grand Total Box Eksekutif */}
                    <div
                      style={{
                        backgroundColor: "#0F172A",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            lineHeight: "1.2",
                          }}
                        >
                          Total Keseluruhan Pengeluaran
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#94A3B8",
                            marginTop: "2px",
                            lineHeight: "1.2",
                          }}
                        >
                          Akumulasi {transactions.length} transaksi pada bulan {monthName}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 900,
                          color: "#34D399",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: "1",
                        }}
                      >
                        {formatRupiah(totalAmount)}
                      </div>
                    </div>

                    {/* Dua Kolom Tanda Tangan Formal */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #CBD5E1",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            lineHeight: "1",
                          }}
                        >
                          Mengetahui / Menyetujui
                        </div>
                        <div style={{ height: "40px" }} />
                        <div
                          style={{
                            borderBottom: "1.5px dashed #94A3B8",
                            width: "75%",
                            margin: "0 auto",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 800,
                            color: "#0F172A",
                            marginTop: "5px",
                            lineHeight: "1.2",
                          }}
                        >
                          Orang Tua / Wali
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#64748B",
                            lineHeight: "1",
                          }}
                        >
                          Pemantau Realtime DUITKU
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1.5px solid #CBD5E1",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            lineHeight: "1",
                          }}
                        >
                          Pembuat Laporan
                        </div>
                        <div style={{ height: "40px" }} />
                        <div
                          style={{
                            borderBottom: "1.5px dashed #94A3B8",
                            width: "75%",
                            margin: "0 auto",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 800,
                            color: "#0F172A",
                            marginTop: "5px",
                            lineHeight: "1.2",
                          }}
                        >
                          {ownerName}
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#64748B",
                            lineHeight: "1",
                          }}
                        >
                          Pemilik Jurnal DUITKU
                        </div>
                      </div>
                    </div>

                    {/* Seal / Stempel Verifikasi Sistem */}
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#059669",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ✓ DOKUMEN DIGITAL INI SAH DAN DITERBITKAN SECARA OTOMATIS OLEH SISTEM DUITKU
                    </div>
                  </div>
                )}
              </div>

              {/* ===================================================
                  FOOTER RESMI SETIAP HALAMAN
                  =================================================== */}
              <div
                style={{
                  borderTop: "1.5px solid #CBD5E1",
                  paddingTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "9.5px",
                  color: "#64748B",
                }}
              >
                <div>
                  Dicetak otomatis oleh <strong>DUITKU PWA</strong> • {printedDate}
                </div>
                <div style={{ fontWeight: 700, color: "#0F172A" }}>
                  Halaman {pageNumber} dari {totalPages}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
