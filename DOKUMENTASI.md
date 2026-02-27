# 📘 Dokumentasi Lengkap: Pusat Interkoneksi Data Nasional (API Portal)

> **Versi:** 1.0.0 | **Dibuat:** Februari 2026 | **Stack:** FastAPI + Next.js + Oracle DB

---

## 📌 1. Tujuan Aplikasi

Aplikasi ini adalah **Skeleton Full-Stack untuk kebutuhan Pelatihan API Engineering**.

Skenario bisnis yang disimulasikan adalah sebuah **Portal API Nasional** milik pemerintah, di mana:
- **Admin Pusat** mengelola mitra (instansi daerah/K/L) yang berhak mengakses data nasional.
- **Mitra (Partner)** mengajukan permintaan akses data (*Interlink Request*) dan mengambil data secara batch (*Snapshot*).
- Seluruh aktivitas dicatat di **Audit Log** dan penggunaan kuota dipantau di **Traffic Monitor**.

Tujuan pelatihan yang dicapai meliputi:
1. Desain dan implementasi **REST API Contract**
2. **JWT Authentication** dan **Role-Based Access Control (RBAC)**
3. Integrasi backend dengan **Oracle Database** menggunakan SQLAlchemy
4. Pembuatan frontend modern dengan **Next.js App Router**
5. **Git Workflow** profesional (`main`, `develop`, `feature/*`)

---

## 🏗️ 2. Arsitektur Sistem

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)              │
│   localhost:3000  |  App Router  |  Tailwind CSS      │
└──────────────────────┬───────────────────────────────┘
                       │  HTTP/JSON (Axios)
                       │  Bearer Token (JWT)
┌──────────────────────▼───────────────────────────────┐
│                   BACKEND (FastAPI)                    │
│   localhost:8000  |  Python 3.13  |  SQLAlchemy ORM  │
│                                                       │
│   Middleware: CORS + AuditLog                         │
│   Auth: OAuth2 Password Flow + JWT (python-jose)      │
└──────────────────────┬───────────────────────────────┘
                       │  oracle+oracledb://
┌──────────────────────▼───────────────────────────────┐
│              DATABASE (Oracle DB / freepdb1)          │
│   Tables: partners, interconnection_requests,         │
│           audit_logs, snapshot_jobs, snapshot_data    │
└──────────────────────────────────────────────────────┘
```

---

## 🗂️ 3. Struktur Folder

### Backend (`/backend`)
```
backend/
├── .env                    # Konfigurasi environment (DB, JWT Secret)
├── requirements.txt        # Daftar library Python
├── init_db.py              # Script inisialisasi database & seed data
└── app/
    ├── main.py             # Entry point FastAPI (CORS, middleware, router)
    ├── core/
    │   ├── config.py       # Settings (database URL, JWT config)
    │   └── security.py     # Hash password, buat JWT, verifikasi JWT
    ├── db/
    │   ├── base_class.py   # SQLAlchemy declarative base
    │   ├── base.py         # Import semua model (untuk create_all)
    │   └── session.py      # Engine & SessionLocal
    ├── models/             # Definisi tabel database (SQLAlchemy ORM)
    │   ├── partner.py      # Tabel: partners
    │   ├── interconnection.py  # Tabel: interconnection_requests
    │   ├── snapshot.py     # Tabel: snapshot_jobs, snapshot_data
    │   └── audit.py        # Tabel: audit_logs
    ├── schemas/            # Pydantic models (validasi request/response)
    │   ├── partner.py      # Token, PartnerCreate, PartnerResponse
    │   ├── interconnection.py  # InterconnectionCreate, InterconnectionResponse
    │   └── audit.py        # AuditLogResponse
    ├── api/
    │   ├── deps.py         # Dependency injection (get_db, get_current_user)
    │   └── routes/
    │       ├── auth.py         # POST /auth/login
    │       ├── partners.py     # GET/POST /partners/
    │       ├── interconnections.py  # GET/POST /interconnections/
    │       ├── snapshot.py     # POST /snapshot/run, GET /snapshot/jobs
    │       └── admin.py        # GET /admin/audit-logs, /admin/traffic
    └── middlewares/
        └── audit.py        # Middleware: log setiap request ke audit_logs
```

### Frontend (`/frontend/src`)
```
frontend/src/
├── app/
│   ├── globals.css         # Design system (glass-card, btn-primary, dll)
│   ├── layout.tsx          # Root layout (font, AuthProvider, LayoutWrapper)
│   ├── layout_wrapper.tsx  # Sidebar + main content area
│   ├── page.tsx            # Halaman Dashboard (/)
│   ├── login/page.tsx      # Halaman Login (/login)
│   ├── partners/page.tsx   # Halaman Partners (/partners)
│   ├── interconnections/page.tsx  # Halaman Interconnections
│   ├── snapshot/page.tsx   # Halaman Snapshot
│   └── admin/
│       ├── audit/page.tsx  # Halaman Audit Logs (/admin/audit)
│       └── traffic/page.tsx  # Halaman Traffic (/admin/traffic)
├── components/
│   └── Sidebar.tsx         # Navigasi sidebar dengan Link dan Sign Out
├── contexts/
│   └── AuthContext.tsx     # Global auth state (login, logout, token)
└── lib/
    └── apiClient.ts        # Axios instance (base URL, token interceptor)
```

---

## 🔐 4. Autentikasi & Keamanan

### Alur Login
1. User memasukkan **API Key** (sebagai username) dan **Password**.
2. Frontend mengirim `POST /api/v1/auth/login` dengan `Content-Type: application/x-www-form-urlencoded`.
3. Backend (`OAuth2PasswordRequestForm`) memverifikasi kredensial ke tabel `partners`.
4. Jika valid, server mengembalikan `access_token` (JWT) dengan masa aktif 7 hari.
5. Token disimpan di `localStorage` dan dikirim di setiap request berikutnya sebagai `Authorization: Bearer <token>`.

### Sistem Role
| Role | Akses |
|------|-------|
| `admin` | Semua endpoint (Partners, Audit, Traffic) |
| `partner` | Interconnections, Snapshot (dengan batasan kuota) |

### Akun Demo
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Partner | `partner1` | `partner123` |

---

## 📄 5. Penjelasan Per Halaman

---

### 5.1 🔑 Login Page (`/login`)

**Tujuan:** Pintu masuk utama ke portal.

**Fitur:**
- Form input API Key dan Password.
- Tombol **"Authorize Session"** → mengirim request ke backend.
- Jika sukses, token disimpan dan user diarahkan ke Dashboard.
- Jika gagal, pesan error ditampilkan.

**API yang digunakan:**
```
POST /api/v1/auth/login
Body: username=<api_key>&password=<password>
Response: { "access_token": "...", "token_type": "bearer" }
```

---

### 5.2 📊 Dashboard (`/`)

**Tujuan:** Gambaran umum kondisi sistem secara real-time.

**Fitur & Tombol:**
| Elemen | Fungsi |
|--------|--------|
| **4 StatCard** | Menampilkan Total Partners, Total Requests, Last Snapshot, System Health — di-fetch dari API |
| **Tombol "Refresh Node"** | Re-fetch semua data dari API, indikator spin saat loading |
| **Tombol "Export Analytics"** | Download stats sebagai file `.txt` |
| **Audit Stream** | Daftar aktivitas sistem simulasi (statis) |
| **Tombol "Archive"** | Re-fetch data dashboard |
| **Tombol "Scale Infrastructure"** | Re-fetch data + animasi loading |

**API yang digunakan:**
```
GET /api/v1/partners/
GET /api/v1/interconnections/
```

---

### 5.3 👥 Partners (`/partners`)

**Tujuan:** Manajemen mitra/instansi yang menggunakan portal API.

**Fitur & Tombol:**
| Elemen | Fungsi |
|--------|--------|
| **Tombol "Register Node"** | Membuka modal form pendaftaran partner baru |
| **Modal Form** | Input: Nama Institusi, API Key, Password, Daily Quota → `POST /partners/` |
| **Live Search Bar** | Filter tabel secara real-time berdasarkan nama atau API key |
| **Tombol "Config"** (hover row) | Menampilkan info placeholder (siap dikembangkan) |
| **Tombol "Revoke"** (hover row) | Dialog konfirmasi → hapus akses partner |

**Tampilan Tabel:**
- Nama Institusi + Inisial Avatar
- API Key (masked dalam font mono)
- Daily Quota (angka)
- Node Status (Active dengan animasi pulse)
- Aksi: Config, Revoke (muncul saat hover)

**API yang digunakan:**
```
GET  /api/v1/partners/          → List semua partners
POST /api/v1/partners/          → Daftarkan partner baru
```

---

### 5.4 🔗 Interconnections (`/interconnections`)

**Tujuan:** Pengajuan dan pemantauan permintaan akses data lintas instansi.

**Fitur & Tombol:**
| Elemen | Fungsi |
|--------|--------|
| **Tombol "New Interlink"** | Membuka modal form pengajuan request baru |
| **Modal Form** | Input: Target Resource, Purpose/Justification → `POST /interconnections/` |
| **Tabel Request** | Daftar semua permintaan yang diajukan (resource, tujuan, tanggal, status) |
| **Status Badge** | APPROVED (hijau) / PENDING (biru) / REJECTED (merah) |
| **Row Action (···)** | Info toast (siap dikembangkan untuk detail modal) |

**Status Permintaan:**
- `PENDING` — Baru diajukan, menunggu persetujuan admin.
- `APPROVED` — Sudah disetujui, mitra boleh mengambil data.
- `REJECTED` — Ditolak.

**API yang digunakan:**
```
GET  /api/v1/interconnections/  → List semua permintaan
POST /api/v1/interconnections/  → Ajukan permintaan baru
Body: { "requested_resource": "DATA_KEPENDUDUKAN", "purpose": "..." }
```

---

### 5.5 📸 Snapshot (`/snapshot`)

**Tujuan:** Pengambilan data secara batch (*point-in-time capture*) dari resource nasional.

**Konsep:** Snapshot mensimulasikan proses "unduh data sekarang" dari sumber data terpusat, dengan dukungan background task dan pencatatan versi.

**Fitur & Tombol:**
| Elemen | Fungsi |
|--------|--------|
| **Tombol "Execute Capture"** | Memicu snapshot baru ke resource `DEMO_DATA` → `POST /snapshot/run` |
| **Tombol "Refresh"** | Re-fetch daftar job history dari server |
| **Job History Table** | Daftar semua snapshot yang pernah dijalankan |
| **Status Badge** | RUNNING (kuning) / COMPLETED (hijau) / FAILED (merah) |

**Alur Snapshot:**
1. User klik "Execute Capture".
2. Backend membuat `SnapshotJob` baru di database.
3. Backend menjalankan `generate_snapshot_data()` secara background.
4. Setelah 2 detik, frontend otomatis refresh untuk melihat status terbaru.

**API yang digunakan:**
```
POST /api/v1/snapshot/run?resource=DEMO_DATA  → Mulai snapshot baru
GET  /api/v1/snapshot/jobs                    → List semua job history
GET  /api/v1/snapshot/status/{job_id}         → Cek status job spesifik
GET  /api/v1/snapshot/data/{job_id}           → Ambil hasil data snapshot
```

---

### 5.6 📋 Audit Logs (`/admin/audit`)

**Tujuan:** Transparansi dan kepatuhan — setiap aktivitas di sistem dicatat otomatis.

> ⚠️ **Hanya dapat diakses oleh Admin.**

**Cara Kerja:** Setiap request yang masuk ke backend dicatat oleh `AuditMiddleware` secara otomatis: path, method, IP, status code, durasi proses, dan partner ID.

**Fitur & Tombol:**
| Elemen | Fungsi |
|--------|--------|
| **Tombol "Refresh"** | Re-fetch log terbaru dari server |
| **Tombol "Export CSV"** | Download seluruh log sebagai file `.csv` (siap dibuka di Excel) |
| **Tabel Audit** | Activity path, method, partner, IP address, status code, timestamp |
| **Status Badge** | Hijau (< 400) untuk sukses, Merah (≥ 400) untuk error |

**Contoh Log Entry:**
| Path | Method | Partner | IP | Status | Waktu |
|------|--------|---------|-----|--------|-------|
| `/api/v1/auth/login` | POST | SYSTEM_CORE | 127.0.0.1 | 200 | 27/02/2026 |

**API yang digunakan:**
```
GET /api/v1/admin/audit-logs?skip=0&limit=100
Response: [{ id, action, path, method, ip, status_code, detail, partner_id, created_at }]
```

---

### 5.7 📈 Traffic & Utilization (`/admin/traffic`)

**Tujuan:** Memantau penggunaan kuota API per mitra secara visual.

> ⚠️ **Hanya dapat diakses oleh Admin.**

**Fitur:**
| Elemen | Fungsi |
|--------|--------|
| **Card per Partner** | Menampilkan nama mitra, kuota digunakan vs total, persentase |
| **Progress Bar** | Biru-violet normal, Merah-orange jika > 90% |
| **Live Status Indicator** | Animasi pulse hijau — menandakan node aktif |

**Interpretasi Data:**
- `quota_used` — berapa kali mitra sudah memanggil API hari ini.
- `quota_daily` — batas maksimum panggilan API per hari.
- `usage_percentage` — (`quota_used / quota_daily * 100`).

**API yang digunakan:**
```
GET /api/v1/admin/traffic
Response: [{ partner_name, quota_daily, quota_used, usage_percentage }]
```

---

## 🔌 6. Daftar Lengkap API Endpoint

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| `POST` | `/api/v1/auth/login` | Login, mendapat JWT token | ❌ | — |
| `GET` | `/api/v1/partners/` | List semua mitra | ✅ | Admin |
| `POST` | `/api/v1/partners/` | Daftarkan mitra baru | ✅ | Admin |
| `GET` | `/api/v1/interconnections/` | List semua permintaan interkoneksi | ✅ | Admin/Partner |
| `POST` | `/api/v1/interconnections/` | Ajukan permintaan baru | ✅ | Admin/Partner |
| `POST` | `/api/v1/snapshot/run` | Mulai snapshot job | ✅ | Admin/Partner |
| `GET` | `/api/v1/snapshot/jobs` | List semua snapshot job | ✅ | Admin/Partner |
| `GET` | `/api/v1/snapshot/status/{job_id}` | Cek status snapshot spesifik | ✅ | Admin/Partner |
| `GET` | `/api/v1/snapshot/data/{job_id}` | Ambil hasil data snapshot | ✅ | Admin/Partner |
| `GET` | `/api/v1/admin/audit-logs` | List audit log sistem | ✅ | Admin |
| `GET` | `/api/v1/admin/traffic` | Data utilisasi kuota per mitra | ✅ | Admin |
| `GET` | `/health` | Health check backend | ❌ | — |

> 📖 Dokumentasi interaktif Swagger tersedia di: **http://localhost:8000/api/docs**

---

## 🛠️ 7. Cara Menjalankan

### Prasyarat
- Python 3.10+
- Node.js 18+
- Oracle Database (XE/freepdb1) berjalan di port 1521

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # Isi dengan kredensial Oracle Anda
python init_db.py           # Buat tabel + seed data awal
uvicorn app.main:app --reload
# → Server berjalan di http://localhost:8000
```

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
# → Aplikasi berjalan di http://localhost:3000
```

---

## 🗃️ 8. Skema Database

### Tabel `partners`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | Integer (PK) | Auto-increment via sequence |
| `name` | String(100) | Nama institusi |
| `api_key` | String(100) | Username untuk login (unique) |
| `hashed_password` | String(200) | Password di-hash dengan bcrypt |
| `role` | String(20) | `admin` atau `partner` |
| `quota_daily` | Integer | Batas panggilan API per hari |
| `quota_used` | Integer | Panggilan API yang sudah dipakai |
| `is_active` | Boolean | Status aktif/nonaktif |
| `created_at` | DateTime | Waktu pendaftaran |

### Tabel `interconnection_requests`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | Integer (PK) | Auto-increment |
| `partner_id` | Integer (FK) | Referensi ke `partners.id` |
| `requested_resource` | String(255) | Nama resource yang diminta |
| `purpose` | Text | Alasan pengajuan |
| `status` | String(50) | `PENDING`, `APPROVED`, `REJECTED` |
| `requested_at` | DateTime | Waktu pengajuan |
| `approved_at` | DateTime | Waktu persetujuan (nullable) |

### Tabel `snapshot_jobs`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | Integer (PK) | Auto-increment |
| `resource` | String(255) | Nama resource yang di-capture |
| `status` | String(50) | `RUNNING`, `COMPLETED`, `FAILED` |
| `version` | String(20) | Tag versi (misal: v1.0) |
| `started_at` | DateTime | Waktu mulai |
| `finished_at` | DateTime | Waktu selesai (nullable) |

### Tabel `audit_logs`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | Integer (PK) | Auto-increment |
| `partner_id` | Integer (FK) | Siapa yang melakukan request (nullable) |
| `action` | String(100) | Deskripsi aksi (misal: `POST /api/v1/auth/login`) |
| `path` | String(255) | URL path |
| `method` | String(10) | HTTP method |
| `ip` | String(50) | IP address client |
| `status_code` | Integer | HTTP response code |
| `detail` | Text | Info tambahan (durasi proses) |
| `created_at` | DateTime | Waktu kejadian |

---

## 🎨 9. Design System (Frontend)

Aplikasi menggunakan **Glassmorphism Dark Theme** dengan:
- **Font:** Inter (Google Fonts)
- **Color Palette:** Indigo/Violet untuk aksi utama, Emerald untuk sukses, Red untuk error/warning.

### CSS Classes Utama (`globals.css`)
| Class | Deskripsi |
|-------|-----------|
| `.glass-card` | Card dengan efek frosted glass (blur + border subtle) |
| `.glass-panel` | Panel sidebar dengan backdrop blur |
| `.gradient-text` | Text dengan gradient dari putih ke indigo-violet |
| `.btn-primary` | Tombol utama warna indigo dengan hover effect |
| `.premium-table` | Table dengan row spacing dan hover highlight |
| `.animate-entrance` | Animasi slide-up saat komponen pertama kali muncul |

---

## 📚 10. Skenario Penggunaan (Use Cases)

### UC-01: Admin Mendaftarkan Mitra Baru
1. Login sebagai `admin` / `admin123`.
2. Buka halaman **Partners**.
3. Klik tombol **"Register Node"**.
4. Isi form (Nama, API Key, Password, Kuota) → Submit.
5. Mitra baru muncul di tabel.

### UC-02: Mitra Mengajukan Permintaan Interkoneksi
1. Login sebagai `partner1` / `partner123`.
2. Buka halaman **Interconnections**.
3. Klik **"New Interlink"**.
4. Isi Target Resource (misal: `DATA_VAKSINASI`) dan Tujuan.
5. Submit → permintaan masuk dengan status `PENDING`.

### UC-03: Menjalankan Snapshot Data
1. Login sebagai `partner1` / `partner123`.
2. Buka halaman **Snapshot**.
3. Klik **"Execute Capture"**.
4. Tunggu 2 detik → klik **"Refresh"** untuk melihat job terbaru.
5. Status berubah dari `RUNNING` menjadi `COMPLETED`.

### UC-04: Admin Mengekspor Audit Log
1. Login sebagai `admin`.
2. Buka halaman **Audit Logs**.
3. Klik tombol **"Export CSV"**.
4. File `.csv` terunduh dan siap dibuka di Excel.

---

*Dokumen ini dibuat secara otomatis sebagai bagian dari materi pelatihan API Engineering.*
