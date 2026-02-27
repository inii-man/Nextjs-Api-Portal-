# API Contract Definitions (v1)

## Base URL: `/api/v1`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/auth/login` | Login via API Key & Pwd | - | - |
| GET | `/partners` | List Mitra | JWT | Admin |
| POST | `/partners` | Tambah Mitra Baru | JWT | Admin |
| POST | `/interconnections` | Create Request | JWT | Partner/Admin |
| GET | `/interconnections` | List Requests | JWT | Partner/Admin |
| POST | `/snapshot/run` | Trigger Snapshot Job | JWT | Partner/Admin |
| GET | `/snapshot/data` | Fetch Snapshot JSON | JWT | Partner/Admin |
| GET | `/admin/audit-logs`| System Audit Trail | JWT | Admin |
| GET | `/admin/traffic` | Usage & Quota Info | JWT | Admin |

## Error Responses
Semua error mengikuti format JSON:
```json
{
  "detail": "Pesan error spesifik",
  "error_code": "code"
}
```
Rate Limit (429) akan menyertakan header `Retry-After`.
