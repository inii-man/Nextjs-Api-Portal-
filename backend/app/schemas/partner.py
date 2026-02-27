from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PartnerBase(BaseModel):
    name: Optional[str] = None
    api_key: Optional[str] = None
    is_active: Optional[bool] = True
    quota_daily: Optional[int] = 100

class PartnerCreate(PartnerBase):
    name: str
    password: str

class PartnerUpdate(PartnerBase):
    password: Optional[str] = None

class Partner(PartnerBase):
    id: int
    quota_used: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
