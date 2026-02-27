# Tujuan Aplikasi: Pusat Interkoneksi Data Nasional (API Portal)

## 📌 Ringkasan

Aplikasi ini adalah **Skeleton Full-Stack untuk Pelatihan API Engineering selama 5 hari**. Ia mensimulasikan sebuah **Portal API Nasional** di mana pemerintah pusat (Admin) mengelola dan memantau akses data dari berbagai instansi/mitra daerah (Partner).

**Panduan instalasi lengkap:** → [README.md](./README.md)  
**Dokumentasi fitur & halaman:** → [DOKUMENTASI.md](./DOKUMENTASI.md)  
**Kontrak API endpoint:** → [API-DEFINITION.md](./API-DEFINITION.md)

---

## 🎯 Fitur Utama (Simulasi Bisnis)

| Fitur | Deskripsi |
|-------|-----------|
| **Partner Management** | Admin mendaftarkan dan mengelola mitra yang berhak mengakses API |
| **Interconnection Requests** | Mitra mengajukan permintaan akses ke resource data tertentu |
| **Snapshot Data** | Mitra mengambil data secara batch (point-in-time capture) |
| **Audit Trail** | Setiap aktivitas dicatat otomatis oleh middleware |
| **Traffic Monitoring** | Admin memantau penggunaan kuota API per mitra |

---

## 💻 Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Axios |
| Backend | Python, FastAPI, SQLAlchemy, python-jose (JWT), passlib |
| Database | Oracle Database (via oracledb driver) |
| Auth | OAuth2 Password Flow + JWT Bearer Token |

---

## 📚 Tujuan Pelatihan

1. Desain **REST API Contract** → implementasi di FastAPI
2. **JWT Authentication** & Role-Based Access Control (Admin vs Partner)
3. Integrasi **Oracle Database** dengan SQLAlchemy ORM
4. Pembuatan Frontend modern dengan **Next.js App Router**
5. Professional **Git Workflow** (`feature → develop → main`)

---

## 👤 Akun Demo

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Partner | `partner1` | `partner123` |
