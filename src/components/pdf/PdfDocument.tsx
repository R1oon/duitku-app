import React from "react";
import { Transaction } from "@/lib/supabase";
import {
  formatRupiah,
  formatMonthYear,
  formatHeaderDate,
  formatShortDate,
  formatTime,
} from "@/lib/format";

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

    // Konfigurasi pembagian halaman (1 atau 2 halaman)
    const ROWS_PAGE_1 = 18;
    const ROWS_PAGE_2 = 26;

    const needsPage2 = transactions.length > ROWS_PAGE_1;
    const totalPages = needsPage2 ? 2 : 1;

    const page1Transactions = transactions.slice(0, ROWS_PAGE_1);
    const page2Transactions = needsPage2
      ? transactions.slice(ROWS_PAGE_1, ROWS_PAGE_1 + ROWS_PAGE_2)
      : [];

    // Gaya Standar Dokumen Formal
    const fontPrimary = "'Times New Roman', Times, 'Liberation Serif', serif";
    const fontClean = "Arial, Helvetica, sans-serif";
    const fontMono = "'Courier New', Courier, monospace";

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "#FFFFFF",
          color: "#000000",
        }}
      >
        {/* ===================================================
            HALAMAN 1 — HEADER, RINGKASAN & TABEL UTAMA
            =================================================== */}
        <div
          id="pdf-page-1"
          className="pdf-report-page"
          style={{
            width: "794px",
            height: "1123px",
            padding: "54px 60px",
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            fontFamily: fontClean,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Kop / Header Dokumen Formal */}
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px solid #000000",
                paddingBottom: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#4B5563",
                  marginBottom: "4px",
                }}
              >
                DUITKU — SISTEM PENCATATAN KEUANGAN
              </div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  margin: "0 0 6px 0",
                  textTransform: "uppercase",
                  color: "#000000",
                  fontFamily: fontPrimary,
                }}
              >
                LAPORAN PENGELUARAN
              </h1>
              <div
                style={{
                  fontSize: "12px",
                  color: "#374151",
                  display: "flex",
                  justifyContent: "center",
                  gap: "24px",
                }}
              >
                <span>
                  <strong>Periode:</strong> {monthName}
                </span>
                <span>•</span>
                <span>
                  <strong>Nama Jurnal:</strong> {ownerName}
                </span>
                <span>•</span>
                <span>
                  <strong>Tanggal Cetak:</strong> {printedDate}
                </span>
              </div>
            </div>

            {/* Bagian 1: Ringkasan Bulan */}
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#111827",
                  marginBottom: "6px",
                  borderLeft: "3px solid #000000",
                  paddingLeft: "8px",
                }}
              >
                I. Ringkasan {monthName}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "6px",
                }}
              >
                <div
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#6B7280",
                    }}
                  >
                    Total Pengeluaran
                  </span>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#000000",
                      marginTop: "4px",
                      fontFamily: fontClean,
                    }}
                  >
                    {formatRupiah(totalAmount)}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#6B7280",
                    }}
                  >
                    Jumlah Transaksi
                  </span>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#000000",
                      marginTop: "4px",
                      fontFamily: fontClean,
                    }}
                  >
                    {transactions.length} Transaksi
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 2: Tabel Transaksi */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#111827",
                  marginBottom: "8px",
                  borderLeft: "3px solid #000000",
                  paddingLeft: "8px",
                }}
              >
                II. Rincian Transaksi
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "11px",
                  border: "1px solid #9CA3AF",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#E5E7EB",
                      borderBottom: "1.5px solid #000000",
                      color: "#000000",
                    }}
                  >
                    <th
                      style={{
                        padding: "8px 6px",
                        textAlign: "center",
                        width: "35px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      No
                    </th>
                    <th
                      style={{
                        padding: "8px 8px",
                        textAlign: "center",
                        width: "85px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Tanggal
                    </th>
                    <th
                      style={{
                        padding: "8px 8px",
                        textAlign: "center",
                        width: "55px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Jam
                    </th>
                    <th
                      style={{
                        padding: "8px 10px",
                        textAlign: "left",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Barang / Keterangan
                    </th>
                    <th
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        width: "110px",
                        fontWeight: 700,
                      }}
                    >
                      Nominal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page1Transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "24px",
                          color: "#6B7280",
                          fontStyle: "italic",
                        }}
                      >
                        Tidak ada catatan transaksi pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    page1Transactions.map((tx, idx) => (
                      <tr
                        key={tx.id}
                        style={{
                          borderBottom: "1px solid #E5E7EB",
                          backgroundColor:
                            idx % 2 === 1 ? "#F9FAFB" : "#FFFFFF",
                        }}
                      >
                        <td
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            borderRight: "1px solid #E5E7EB",
                            color: "#4B5563",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            textAlign: "center",
                            borderRight: "1px solid #E5E7EB",
                            whiteSpace: "nowrap",
                            color: "#111827",
                          }}
                        >
                          {formatShortDate(tx.created_at)}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            textAlign: "center",
                            borderRight: "1px solid #E5E7EB",
                            fontFamily: fontMono,
                            fontSize: "10px",
                            color: "#374151",
                          }}
                        >
                          {formatTime(tx.created_at)}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            borderRight: "1px solid #E5E7EB",
                            color: "#111827",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            {tx.item_name}
                          </span>
                          {tx.note && (
                            <span
                              style={{
                                color: "#4B5563",
                                fontSize: "10px",
                                marginLeft: "6px",
                                fontStyle: "italic",
                              }}
                            >
                              ({tx.note})
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            textAlign: "right",
                            fontWeight: 700,
                            fontFamily: fontMono,
                            fontSize: "11px",
                            color: "#000000",
                          }}
                        >
                          {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Jika hanya 1 halaman, tampilkan baris Total langsung di bawah */}
                  {!needsPage2 && page1Transactions.length > 0 && (
                    <tr
                      style={{
                        backgroundColor: "#E5E7EB",
                        borderTop: "2px solid #000000",
                        fontWeight: 800,
                      }}
                    >
                      <td
                        colSpan={4}
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderRight: "1px solid #D1D5DB",
                          fontSize: "11px",
                        }}
                      >
                        Total Keseluruhan :
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: fontMono,
                          fontSize: "12px",
                          fontWeight: 900,
                          color: "#000000",
                        }}
                      >
                        {formatRupiah(totalAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {needsPage2 && (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "10px",
                    color: "#6B7280",
                    fontStyle: "italic",
                    marginTop: "6px",
                  }}
                >
                  * Bersambung ke halaman 2...
                </div>
              )}
            </div>

            {/* Kolom Tanda Tangan Formal (Jika 1 Halaman) */}
            {!needsPage2 && (
              <div
                style={{
                  marginTop: "36px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  padding: "0 24px",
                }}
              >
                <div style={{ textAlign: "center", width: "160px" }}>
                  <div>Mengetahui,</div>
                  <div style={{ marginTop: "55px", borderBottom: "1px solid #000000" }}></div>
                  <div style={{ marginTop: "4px", color: "#6B7280" }}>( Orang Tua / Wali )</div>
                </div>

                <div style={{ textAlign: "center", width: "160px" }}>
                  <div>Pembuat Laporan,</div>
                  <div style={{ marginTop: "55px", borderBottom: "1px solid #000000" }}>
                    <strong>{ownerName}</strong>
                  </div>
                  <div style={{ marginTop: "4px", color: "#6B7280" }}>( Pemilik Jurnal )</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Dokumen Halaman 1 */}
          <div
            style={{
              borderTop: "1px solid #D1D5DB",
              paddingTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#6B7280",
            }}
          >
            <span>Generated by DUITKU Financial System</span>
            <span>
              Halaman 1 dari {totalPages}
            </span>
          </div>
        </div>

        {/* ===================================================
            HALAMAN 2 — LANJUTAN TABEL (HANYA JIKA DIBUTUHKAN)
            =================================================== */}
        {needsPage2 && (
          <div
            id="pdf-page-2"
            className="pdf-report-page"
            style={{
              width: "794px",
              height: "1123px",
              padding: "54px 60px",
              boxSizing: "border-box",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              fontFamily: fontClean,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Header Lanjutan Halaman 2 */}
              <div
                style={{
                  borderBottom: "1px solid #000000",
                  paddingBottom: "8px",
                  marginBottom: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#374151",
                }}
              >
                <span>
                  <strong>LAPORAN PENGELUARAN — {monthName}</strong> (Lanjutan)
                </span>
                <span>Nama Jurnal: {ownerName}</span>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "11px",
                  border: "1px solid #9CA3AF",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#E5E7EB",
                      borderBottom: "1.5px solid #000000",
                      color: "#000000",
                    }}
                  >
                    <th
                      style={{
                        padding: "8px 6px",
                        textAlign: "center",
                        width: "35px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      No
                    </th>
                    <th
                      style={{
                        padding: "8px 8px",
                        textAlign: "center",
                        width: "85px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Tanggal
                    </th>
                    <th
                      style={{
                        padding: "8px 8px",
                        textAlign: "center",
                        width: "55px",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Jam
                    </th>
                    <th
                      style={{
                        padding: "8px 10px",
                        textAlign: "left",
                        borderRight: "1px solid #D1D5DB",
                        fontWeight: 700,
                      }}
                    >
                      Barang / Keterangan
                    </th>
                    <th
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        width: "110px",
                        fontWeight: 700,
                      }}
                    >
                      Nominal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page2Transactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: "1px solid #E5E7EB",
                        backgroundColor:
                          idx % 2 === 1 ? "#F9FAFB" : "#FFFFFF",
                      }}
                    >
                      <td
                        style={{
                          padding: "6px",
                          textAlign: "center",
                          borderRight: "1px solid #E5E7EB",
                          color: "#4B5563",
                        }}
                      >
                        {ROWS_PAGE_1 + idx + 1}
                      </td>
                      <td
                        style={{
                          padding: "6px 8px",
                          textAlign: "center",
                          borderRight: "1px solid #E5E7EB",
                          whiteSpace: "nowrap",
                          color: "#111827",
                        }}
                      >
                        {formatShortDate(tx.created_at)}
                      </td>
                      <td
                        style={{
                          padding: "6px 8px",
                          textAlign: "center",
                          borderRight: "1px solid #E5E7EB",
                          fontFamily: fontMono,
                          fontSize: "10px",
                          color: "#374151",
                        }}
                      >
                        {formatTime(tx.created_at)}
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderRight: "1px solid #E5E7EB",
                          color: "#111827",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{tx.item_name}</span>
                        {tx.note && (
                          <span
                            style={{
                              color: "#4B5563",
                              fontSize: "10px",
                              marginLeft: "6px",
                              fontStyle: "italic",
                            }}
                          >
                            ({tx.note})
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          textAlign: "right",
                          fontWeight: 700,
                          fontFamily: fontMono,
                          fontSize: "11px",
                          color: "#000000",
                        }}
                      >
                        {formatRupiah(tx.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Total Baris Akhir di Halaman 2 */}
                  <tr
                    style={{
                      backgroundColor: "#E5E7EB",
                      borderTop: "2px solid #000000",
                      fontWeight: 800,
                    }}
                  >
                    <td
                      colSpan={4}
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderRight: "1px solid #D1D5DB",
                        fontSize: "11px",
                      }}
                    >
                      Total Keseluruhan :
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        fontFamily: fontMono,
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "#000000",
                      }}
                    >
                      {formatRupiah(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tanda Tangan Formal Halaman 2 */}
              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  padding: "0 24px",
                }}
              >
                <div style={{ textAlign: "center", width: "160px" }}>
                  <div>Mengetahui,</div>
                  <div style={{ marginTop: "55px", borderBottom: "1px solid #000000" }}></div>
                  <div style={{ marginTop: "4px", color: "#6B7280" }}>( Orang Tua / Wali )</div>
                </div>

                <div style={{ textAlign: "center", width: "160px" }}>
                  <div>Pembuat Laporan,</div>
                  <div style={{ marginTop: "55px", borderBottom: "1px solid #000000" }}>
                    <strong>{ownerName}</strong>
                  </div>
                  <div style={{ marginTop: "4px", color: "#6B7280" }}>( Pemilik Jurnal )</div>
                </div>
              </div>
            </div>

            {/* Footer Dokumen Halaman 2 */}
            <div
              style={{
                borderTop: "1px solid #D1D5DB",
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#6B7280",
              }}
            >
              <span>Generated by DUITKU Financial System</span>
              <span>Halaman 2 dari 2</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
