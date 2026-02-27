# Tujuan Aplikasi: Pusat Interkoneksi Data Nasional (API Portal)

## 📌 Konteks Umum
Aplikasi ini pada dasarnya adalah sebuah **Skeleton (Kerangka) Aplikasi Full-stack** yang dirancang secara khusus untuk kebutuhan **Pelatihan (Training)** dengan durasi 5 hari. Tema utama pelatihan ini adalah: 
**"Pembuatan Aplikasi API Management (Git & API Engineering Workflow) > Server API"**.

## 🎯 Tujuan Utama
Tujuan utama dari aplikasi ini adalah untuk **mensimulasikan portal manajemen API pemerintahan** (Pusat Interkoneksi Data Nasional). Melalui aplikasi ini, peserta pelatihan dapat mempraktekkan dan memahami alur kerja (workflow) lengkap seorang Software/API Engineer, mulai dari perancangan kontrak API, implementasi backend, integrasi database, hingga pembuatan antarmuka pengguna (frontend) modern.

## 🏗️ Fungsi Bisnis (Simulasi)
Dalam simulasi kasus bisnisnya, aplikasi ini berfungsi sebagai **Platform Penghubung** antara sistem terpusat (Pemerintah Pusat/Admin) dengan berbagai mitra atau instansi daerah (Partner). 

Fitur-fitur simulasi yang disediakan meliputi:
1. **Manajemen Mitra (Partner Management)**: Admin dapat menambahkan dan mengelola data mitra (seperti Dinas Kesehatan, Dukcapil, dll) yang berhak mengakses API.
2. **Permintaan Interkoneksi (Interconnection Requests)**: Mitra dapat mengajukan permintaan untuk mengakses resource data tertentu (misalnya data kependudukan, data kesehatan).
3. **Snapshot Data**: Mitra dapat memicu (trigger) pengambilan data secara batch/snapshot.
4. **Keamanan & Autentikasi**: Menggunakan JWT (JSON Web Tokens) dan Role-Based Access Control (Admin vs Partner).
5. **Traffic & Quota Control**: Membatasi jumlah request (Rate Limiting) dan Kuota Harian (Daily Quota) API yang dapat diakses oleh setiap mitra.
6. **Audit Trail**: Mencatat setiap aktivitas krusial pengguna ke dalam sistem (Audit Logs) untuk kebutuhan pemantauan dan kepatuhan.

## 💻 Aspek Pembelajaran (Engineering)
Bagi peserta pelatihan, aplikasi ini mengajarkan konsep-konsep teknis penting:
- **FastAPI (Python)**: Membangun backend yang cepat dan modern.
- **Next.js & React**: Membangun antarmuka dashboard admin yang responsif dan estetik (dengan *glassmorphism* dan mode gelap).
- **Oracle Database**: Melakukan interkoneksi backend modern dengan database enterprise relasional (menggunakan SQLAlchemy & oracledb).
- **Git Workflow**: Membiasakan bekerja dengan branch (`main`, `develop`, `feature/*`) dan kolaborasi tim.
- **RESTful API Contract**: Membaca dan mengimplementasikan kontrak API (seperti didefinisikan di `API-DEFINITION.md`).

---
*Dokumen ini dibuat secara otomatis untuk memberikan pemahaman singkat mengenai tujuan dan konteks pengembangan repositori ini.*
