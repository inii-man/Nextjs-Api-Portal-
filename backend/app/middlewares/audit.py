import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.db.session import SessionLocal
from app.models.audit import AuditLog
from jose import jwt
from app.core.config import settings
from app.models.partner import Partner

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We need to get the partner_id if available from token
        partner_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                api_key = payload.get("sub")
                db = SessionLocal()
                partner = db.query(Partner).filter(Partner.api_key == api_key).first()
                if partner:
                    partner_id = partner.id
                db.close()
            except:
                pass

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        # Only log important mutations or specific paths
        if request.method in ["POST", "PUT", "DELETE", "PATCH"] or "/api/v1/snapshot" in request.url.path:
            db = SessionLocal()
            audit_entry = AuditLog(
                partner_id=partner_id,
                action=f"{request.method} {request.url.path}",
                path=request.url.path,
                method=request.method,
                ip=request.client.host,
                status_code=response.status_code,
                detail=f"Processed in {process_time:.4f}s"
            )
            db.add(audit_entry)
            db.commit()
            db.close()

        return response
