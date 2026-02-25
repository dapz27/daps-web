# 💻 SIDE TERMINAL : Advanced Data Ingestion System

Sebuah sistem pengumpulan data interaktif berbasis web yang mendobrak desain form konvensional. Mengusung antarmuka *Cyberpunk / Hacker Terminal* dengan animasi *real-time*, aplikasi ini dirancang tidak hanya untuk estetika, tetapi juga fungsionalitas tingkat tinggi untuk manajemen dataset lokal.

## 🚀 Fitur Superior (Hacker Edition)
1. **Live Network Traffic & Marquee:** Animasi *real-time* yang menghasilkan log *traffic* IP dan Hexadesimal secara otomatis untuk imersi maksimal.
2. **Instant Query Databank:** Fitur pencarian data (Live Search) yang langsung memfilter *database* saat *user* mengetik, tanpa perlu me-refresh halaman.
3. **CSV Data Dump:** Kemampuan mengekspor seluruh *database* (atau data yang baru diinput) ke dalam format `.csv` utuh yang siap diolah menggunakan Python (Pandas) atau Excel.
4. **Local Persistent Storage:** Data dijamin aman di memori browser (`localStorage`) dan tidak akan hilang meskipun tab ditutup.
5. **Nuke Protocol (Purge DB):** Tombol eksekusi darurat untuk mengosongkan keseluruhan *database* lokal dalam satu klik dengan konfirmasi keamanan.

## 🛠️ Tech Stack & Modul
- **Core Framework:** React 18 + TypeScript (via Vite)
- **Styling:** Tailwind CSS (dengan Custom Keyframes Animation untuk efek Marquee)
- **Data Export:** Vanilla JS `Blob API` & `URL.createObjectURL`

---

## 🐛 Log Perbaikan Bug & Optimasi (Bug Tracking)

Sesuai standar operasional pengembangan perangkat lunak, berikut adalah dokumentasi *bug* kritis yang ditemukan selama fase *development* dan penyelesaiannya:

**[Bug] Memory Leak Akibat Animasi Network Traffic (Web Laggy/Lemot)**
- **Deskripsi Masalah:** Setelah web dibiarkan terbuka selama lebih dari 5 menit, browser mulai terasa berat (*laggy*) dan penggunaan RAM meningkat drastis.
- **Penyebab Utama:** Fitur *Live Network Traffic* menggunakan fungsi `setInterval` di dalam `useEffect` React untuk men-generate angka acak setiap 600ms. Namun, interval tersebut tidak dihentikan/dibersihkan (*unmounted*) saat komponen me-render ulang, sehingga ratusan proses interval berjalan bersamaan di belakang layar secara *infinite*.
- **Penyelesaian (Fix):** Menambahkan *Cleanup Function* pada siklus hidup (lifecycle) `useEffect`. Memasukkan perintah `clearInterval(interval)` pada *return statement* agar interval lama dihancurkan sebelum interval baru dibuat.

*Keterangan pada Git Commit:*
> `fix: menambahkan cleanup function clearInterval pada useEffect network traffic untuk mencegah memory leak dan lag pada browser`