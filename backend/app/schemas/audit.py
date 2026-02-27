from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogBase(BaseModel):
    action: str
    path: str
    method: str
    ip: str
    status_code: int
    detail: Optional[str] = None
    partner_id: Optional[int] = None

class AuditLogResponse(AuditLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
