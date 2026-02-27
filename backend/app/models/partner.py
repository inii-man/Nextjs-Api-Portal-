from sqlalchemy import Column, Integer, String, Boolean, DateTime, Sequence
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, Sequence('partner_id_seq'), primary_key=True)
    name = Column(String(100), nullable=False)
    api_key = Column(String(100), unique=True)
    quota_daily = Column(Integer, default=100)
    quota_used = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="partner") # admin, partner
    hashed_password = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    requests = relationship("InterconnectionRequest", back_populates="partner")
    audit_logs = relationship("AuditLog", back_populates="partner")
