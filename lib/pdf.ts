import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (step: string) => void;
}

/**
 * Menghasilkan dokumen PDF 3 halaman A4 Portrait menggunakan jsPDF dan html2canvas
 */
export async function generate3PagePdf(options: GeneratePdfOptions = {}): Promise<boolean> {
  const { fileName = "Laporan_Pengeluaran_DUITKU.pdf", onProgress } = options;

  try {
    const page1 = document.getElementById("pdf-page-1");
    const page2 = document.getElementById("pdf-page-2");
    const page3 = document.getElementById("pdf-page-3");

    if (!page1 || !page2 || !page3) {
      throw new Error("Elemen template halaman PDF tidak ditemukan di DOM");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const canvasOptions = {
      scale: 2, // Kualitas cetak tinggi (retina)
      useCORS: true,
      backgroundColor: "#0D0D0D",
      logging: false,
    };

    // Render Halaman 1 (Cover)
    if (onProgress) onProgress("Menyiapkan Halaman 1 (Cover)...");
    const canvas1 = await html2canvas(page1, canvasOptions);
    const imgData1 = canvas1.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData1, "JPEG", 0, 0, 210, 297);

    // Render Halaman 2 (Ringkasan & Chart)
    if (onProgress) onProgress("Menyiapkan Halaman 2 (Ringkasan & Grafik)...");
    pdf.addPage("a4", "portrait");
    const canvas2 = await html2canvas(page2, canvasOptions);
    const imgData2 = canvas2.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData2, "JPEG", 0, 0, 210, 297);

    // Render Halaman 3 (Full Table)
    if (onProgress) onProgress("Menyiapkan Halaman 3 (Tabel Lengkap)...");
    pdf.addPage("a4", "portrait");
    const canvas3 = await html2canvas(page3, canvasOptions);
    const imgData3 = canvas3.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData3, "JPEG", 0, 0, 210, 297);

    if (onProgress) onProgress("Mengunduh file PDF...");
    pdf.save(fileName);

    return true;
  } catch (error: any) {
    console.error("Error saat generate PDF:", error);
    throw new Error(error.message || "Gagal membuat dokumen PDF");
  }
}
