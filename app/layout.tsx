import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DUITKU — Jurnal Pengeluaran Harian",
  description: "Jurnal pengeluaran harian dengan dashboard realtime untuk keluarga.",
  applicationName: "DUITKU",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DUITKU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="bg-[#0D0D0D] text-[#F5F5F5] antialiased min-h-screen">
        <div className="mx-auto w-full max-w-[430px] min-h-screen bg-[#0D0D0D] relative flex flex-col shadow-2xl md:border-x md:border-[#262626]">
          {children}
        </div>
      </body>
    </html>
  );
}
