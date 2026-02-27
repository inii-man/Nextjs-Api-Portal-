# 🛡️ API Portal — Pusat Interkoneksi Data Nasional

> **Skeleton Full-Stack untuk Pelatihan API Engineering** | FastAPI + Next.js 14 + Oracle DB + JWT

---

## 📌 Gambaran Aplikasi

Portal ini mensimulasikan sistem manajemen API pemerintahan di mana **Admin Pusat** mengelola akses mitra/instansi daerah terhadap data nasional. Setiap aktivitas dicatat secara otomatis (*Audit Trail*) dan penggunaan kuota dipantau secara real-time (*Traffic Monitor*).

Lihat dokumentasi lengkap di → **[DOKUMENTASI.md](./DOKUMENTASI.md)**

---

## 🎯 Fokus Materi Pelatihan

1. **REST API Contract** — Desain endpoint, request/response schema
2. **JWT Authentication** — OAuth2 Password Flow, Bearer Token, RBAC
3. **Oracle DB Integration** — SQLAlchemy ORM, Sequences, Pydantic Serialization
4. **Next.js App Router** — Client components, hooks, Axios interceptor
5. **Git Workflow** — Branch `main`, `develop`, `feature/*`

---

## 🏗️ Arsitektur Singkat

```
[Browser] → [Next.js :3000] → [FastAPI :8000] → [Oracle DB :1521]
                              ↕ JWT Auth ↕
                         CORS + AuditMiddleware
```

---

## ⚡ Instalasi & Menjalankan Aplikasi

### Prasyarat
Pastikan sudah terinstall:
- [Python 3.10+](https://python.org)
- [Node.js 18+](https://nodejs.org) dan [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Oracle Database XE](https://www.oracle.com/database/technologies/xe-downloads.html) atau Oracle Free yang berjalan di port 1521

---

### 🔙 1. Setup Backend (FastAPI)

```bash
# 1. Masuk ke folder backend
cd backend

# 2. (Opsional) Buat virtual environment Python
python3 -m venv venv
source venv/bin/activate       # macOS/Linux
# venv\Scripts\activate        # Windows

# 3. Install semua library Python
pip install -r requirements.txt

# 4. Salin dan konfigurasi environment variables
cp .env.example .env
```

**Edit file `.env` sesuai konfigurasi Oracle Anda:**
```env
ORACLE_USER=system
ORACLE_PASSWORD=password         # ← ganti dengan password Oracle Anda
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_SERVICE_NAME=freepdb1     # ← atau XEPDB1 untuk Oracle XE

SECRET_KEY=yoursecretkeyhere     # ← ganti dengan string random yang aman
```

```bash
# 5. Inisialisasi database (buat tabel + seed akun admin & demo partner)
python init_db.py

# 6. Jalankan server backend
uvicorn app.main:app --reload
# ✅ Backend tersedia di: http://localhost:8000
# 📖 Swagger UI: http://localhost:8000/api/docs
```

---

### 🖥️ 2. Setup Frontend (Next.js)

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
pnpm install
# atau: npm install

# 3. (Opsional) Konfigurasi URL backend jika berbeda dari default
# Buat file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# 4. Jalankan development server
pnpm run dev
# ✅ Aplikasi tersedia di: http://localhost:3000
```

---

### ✅ Verifikasi Instalasi

Setelah kedua server berjalan, cek koneksi backend:
```bash
curl http://localhost:8000/health
# Response: {"status":"healthy"}
```

Buka browser: **http://localhost:3000**

Login dengan akun demo:
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Partner | `partner1` | `partner123` |

---

## 🌿 Git Workflow

```bash
# Alur pengembangan fitur baru:
git checkout develop
git checkout -b feature/nama-fitur

# Setelah selesai:
git add .
git commit -m "feat: deskripsi singkat fitur"
git push origin feature/nama-fitur
# → Buat Pull Request ke develop
```

| Branch | Fungsi |
|--------|--------|
| `main` | Kode stabil untuk demo/produksi |
| `develop` | Integrasi fitur sebelum rilis |
| `feature/*` | Pengembangan fitur spesifik |

---

## 📂 Struktur Direktori

```
Nextjs-Api-Portal-/
├── backend/                  # FastAPI (Python)
│   ├── .env                  # ← Konfigurasi database & JWT
│   ├── requirements.txt      # Daftar library
│   ├── init_db.py            # Inisialisasi database
│   └── app/
│       ├── main.py           # Entry point
│       ├── api/routes/       # Endpoint handler
│       ├── models/           # SQLAlchemy ORM models
│       ├── schemas/          # Pydantic schemas
│       ├── core/             # Config & Security
│       └── middlewares/      # Audit middleware
│
├── frontend/                 # Next.js 14 (TypeScript)
│   ├── src/app/              # App Router pages
│   ├── src/components/       # Reusable components (Sidebar)
│   ├── src/contexts/         # AuthContext (JWT state)
│   └── src/lib/              # apiClient (Axios)
│
├── README.md                 # ← File ini (panduan instalasi)
├── DOKUMENTASI.md            # Dokumentasi lengkap semua fitur & halaman
├── TUJUAN_APLIKASI.md        # Ringkasan tujuan & konteks pelatihan
└── API-DEFINITION.md         # Kontrak API endpoint
```

---

## 🔌 API Endpoints Utama

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/v1/auth/login` | ❌ | Login, dapat JWT token |
| GET | `/api/v1/partners/` | Admin | List semua mitra |
| POST | `/api/v1/partners/` | Admin | Daftarkan mitra baru |
| GET | `/api/v1/interconnections/` | ✅ | List permintaan interkoneksi |
| POST | `/api/v1/interconnections/` | ✅ | Ajukan permintaan baru |
| POST | `/api/v1/snapshot/run` | ✅ | Mulai snapshot data |
| GET | `/api/v1/snapshot/jobs` | ✅ | List riwayat snapshot |
| GET | `/api/v1/admin/audit-logs` | Admin | Audit trail sistem |
| GET | `/api/v1/admin/traffic` | Admin | Utilisasi kuota per mitra |

> 📖 **Swagger UI interaktif:** http://localhost:8000/api/docs

---

## ⚠️ Troubleshooting Umum

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `ORA-00942: table does not exist` | Tabel belum dibuat | Jalankan `python init_db.py` |
| `ORA-01017: invalid username/password` | Kredensial Oracle salah | Periksa `.env` |
| `422 Unprocessable Content` saat login | Form data tidak valid | Pastikan `Content-Type: application/x-www-form-urlencoded` |
| `500 Internal Server Error` di Audit Logs | Serialization error (sudah diperbaiki) | Pastikan kode terbaru dipakai |
| `CORS Error` di browser | Origin tidak terdaftar | Cek `BACKEND_CORS_ORIGINS` di `.env` |
| CSS tidak muncul | Config Tailwind hilang | Pastikan `tailwind.config.ts` dan `postcss.config.js` ada |

---

*Skeleton aplikasi ini dibuat untuk keperluan pelatihan API Engineering selama 5 hari.*