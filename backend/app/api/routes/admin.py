from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.partner import Partner
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse

router = APIRouter()

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def read_audit_logs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Partner = Depends(deps.get_current_active_admin),
) -> Any:
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/traffic")
def read_traffic(
    db: Session = Depends(deps.get_db),
    current_user: Partner = Depends(deps.get_current_active_admin),
) -> Any:
    # Agregasi sederhana
    partners = db.query(Partner).all()
    traffic_data = []
    for p in partners:
        traffic_data.append({
            "partner_name": p.name,
            "quota_daily": p.quota_daily,
            "quota_used": p.quota_used,
            "usage_percentage": (p.quota_used / p.quota_daily * 100) if p.quota_daily > 0 else 0
        })
    return traffic_data
