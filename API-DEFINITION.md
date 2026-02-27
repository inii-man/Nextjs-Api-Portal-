# API Contract Definitions (v1)

## Base URL: `/api/v1`

> 📖 **Swagger UI interaktif:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## 🔐 Authentication

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/auth/login` | Login, mendapat JWT Bearer Token | ❌ | — |

**Request Body** (`application/x-www-form-urlencoded`):
```
username=<api_key>&password=<password>
```

**Response:**
```json
{ "access_token": "eyJ...", "token_type": "bearer" }
```

---

## 👥 Partners

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/partners/` | List semua mitra | Bearer | Admin |
| POST | `/partners/` | Daftarkan mitra baru | Bearer | Admin |

**POST /partners/ — Request Body (JSON):**
```json
{
  "name": "Dinas Kesehatan Kota",
  "api_key": "dinas_kes_01",
  "password": "rahasia123",
  "quota_daily": 100
}
```

---

## 🔗 Interconnections

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/interconnections/` | List permintaan interkoneksi | Bearer | Admin/Partner |
| POST | `/interconnections/` | Ajukan permintaan akses data baru | Bearer | Admin/Partner |

**POST /interconnections/ — Request Body (JSON):**
```json
{
  "requested_resource": "DATA_KEPENDUDUKAN",
  "purpose": "Sinkronisasi data warga untuk layanan kesehatan."
}
```

**Status Permintaan:** `PENDING` → `APPROVED` / `REJECTED`

---

## 📸 Snapshot

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/snapshot/run` | Mulai snapshot job baru | Bearer | Admin/Partner |
| GET | `/snapshot/jobs` | List semua riwayat snapshot | Bearer | Admin/Partner |
| GET | `/snapshot/status/{job_id}` | Cek status spesifik job | Bearer | Admin/Partner |
| GET | `/snapshot/data/{job_id}` | Ambil hasil data snapshot | Bearer | Admin/Partner |

**POST /snapshot/run — Query Parameter:**
```
?resource=DEMO_DATA
```

**Batasan:** Jika `quota_used >= quota_daily` → HTTP 429 (Rate Limit)

---

## 🛡️ Admin

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/admin/audit-logs` | List audit trail sistem | Bearer | Admin |
| GET | `/admin/traffic` | Utilisasi kuota per mitra | Bearer | Admin |

**Query Parameters (audit-logs):** `?skip=0&limit=100`

---

## ❌ Error Responses

Semua error menggunakan format JSON standar:
```json
{
  "detail": "Pesan error spesifik"
}
```

| HTTP Code | Keterangan |
|-----------|-----------|
| 400 | Bad Request — data tidak valid |
| 401 | Unauthorized — token tidak ada atau expired |
| 403 | Forbidden — role tidak memiliki akses |
| 404 | Not Found — resource tidak ditemukan |
| 422 | Unprocessable Entity — validasi gagal |
| 429 | Too Many Requests — kuota daily habis |
| 500 | Internal Server Error — error di server |

Rate Limit (429) menyertakan header `Retry-After`.
