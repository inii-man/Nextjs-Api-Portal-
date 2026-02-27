from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class InterconnectionBase(BaseModel):
    requested_resource: Optional[str] = None
    purpose: Optional[str] = None

class InterconnectionCreate(InterconnectionBase):
    requested_resource: str

class Interconnection(InterconnectionBase):
    id: int
    partner_id: int
    status: str
    requested_at: datetime
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
