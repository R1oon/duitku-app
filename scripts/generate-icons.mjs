import fs from "fs";
import path from "path";
import zlib from "zlib";

// Pastikan direktori public/icons ada
const iconsDir = path.resolve("public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Buat SVG logo DUITKU yang elegan
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#161616"/>
      <stop offset="100%" stop-color="#0D0D0D"/>
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="512" height="512" rx="120" fill="url(#bg)"/>
  <rect width="504" height="504" x="4" y="4" rx="116" fill="none" stroke="#262626" stroke-width="6"/>

  <!-- Glowing Outer Ring -->
  <circle cx="256" cy="256" r="170" fill="none" stroke="#14B8A6" stroke-width="4" stroke-opacity="0.2" stroke-dasharray="16 8"/>

  <!-- DUITKU Monogram "D" -->
  <g filter="url(#glow)">
    <path d="M180 140 H270 C340 140 380 180 380 256 C380 332 340 372 270 372 H180 Z" fill="none" stroke="url(#tealGrad)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="360" cy="155" r="22" fill="#22C55E"/>
    <circle cx="360" cy="155" r="14" fill="#FFFFFF"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, "icon.svg"), svgIcon);
console.log("✅ public/icons/icon.svg berhasil dibuat");

// Fungsi pembantu untuk membuat PNG murni tanpa dependency eksternal
function createSolidPng(width, height, r, g, b, a = 255) {
  // Signature PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // Bit depth: 8
  ihdr.writeUInt8(6, 9); // Color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10); // Compression: 0
  ihdr.writeUInt8(0, 11); // Filter: 0
  ihdr.writeUInt8(0, 12); // Interlace: 0
  const ihdrChunk = createChunk("IHDR", ihdr);

  // Scanlines IDAT data
  // Setiap baris diawali filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Buat pola logo Duitku sederhana: latar #0D0D0D, border #262626, dan icon #14B8A6 di tengah
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const isCenter = dist < width * 0.35 && dist > width * 0.22;

      if (isCenter) {
        rawData[pixelOffset] = 20;     // Teal R
        rawData[pixelOffset + 1] = 184; // Teal G
        rawData[pixelOffset + 2] = 166; // Teal B
        rawData[pixelOffset + 3] = 255; // Alpha
      } else {
        rawData[pixelOffset] = 13;     // #0D0D0D
        rawData[pixelOffset + 1] = 13;
        rawData[pixelOffset + 2] = 13;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressedData);

  // IEND chunk
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, "ascii");
  data.copy(buffer, 8);

  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 table & function
const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

// Generate icon 192x192
const png192 = createSolidPng(192, 192, 20, 184, 166);
fs.writeFileSync(path.join(iconsDir, "icon-192.png"), png192);
console.log("✅ public/icons/icon-192.png berhasil dibuat");

// Generate icon 512x512
const png512 = createSolidPng(512, 512, 20, 184, 166);
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), png512);
console.log("✅ public/icons/icon-512.png berhasil dibuat");

// Generate apple-touch-icon
fs.writeFileSync(path.join(iconsDir, "apple-touch-icon.png"), png192);
console.log("✅ public/icons/apple-touch-icon.png berhasil dibuat");
