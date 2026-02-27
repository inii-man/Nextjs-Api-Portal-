# Pelatihan: Pembuatan Aplikasi API Management

Skeleton aplikasi ini dirancang untuk pelatihan 5 hari bertema **"Pembuatan Aplikasi API Management (Git & API Engineering Workflow) > Server API"** dalam konteks interkoneksi data pemerintahan.

## Arsitektur Proyek
- **Backend**: FastAPI (Python) - Role-based Auth, JWT, Oracle DB Integration (via oracledb), Audit Logs, Rate Limiting.
- **Frontend**: Next.js 14 (App Router, TS) - Dashboard, Manajemen Mitra, Workflow Interkoneksi, Monitoring Traffic.

## Git Workflow
Proyek ini mengikuti standar pengelolaan branch:
1. `main`: Kode stabil siap produksi/demo final.
2. `develop`: Integrasi berbagai fitur sebelum rilis.
3. `feature/*`: Pengembangan fitur spesifik (mis. `feature/auth`, `feature/oracle-integration`).
   - Alur: `Requirement` -> `Design Contract` -> `Implement` -> `Pull Request` -> `Merge to develop`.

## Alur Engineering API (Silabus)
1. **Konsep API & Kontrak**: Definisi endpoint di `API-DEFINITION.md`.
2. **Implementasi Server**: Penulisan logic di FastAPI (`app/api/routes`).
3. **Keamanan**: Implementasi JWT & Role Access di `app/api/deps.py`.
4. **Traffic Control**: Rate limit & kuota harian di middleware dan service.
5. **Monitoring & Audit**: Logging setiap aktifitas penting ke tabel `audit_logs`.

## Cara Menjalankan
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `cp .env.example .env` (Pastikan kredensial Oracle di `.env` sudah benar)
4. `python init_db.py`
5. `uvicorn app.main:app --reload`

### Penanganan Database (Oracle vs SQLite)
- **Primary (Oracle)**: Secara default menggunakan Oracle (via `oracledb`). Pastikan service Oracle anda (misal XE) sudah berjalan di port 1521.
- **Fallback (SQLite)**: Jika ingin menggunakan SQLite, Anda bisa mengubah `DATABASE_URL` di `.env` (perlu penyesuaian sedikit di `config.py` jika ingin fleksibel).

## Akun Demo
- **Admin**: `admin` / `admin123`
- **Partner**: `partner1` / `partner123`