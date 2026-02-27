from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Sequence
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, Sequence('audit_log_id_seq'), primary_key=True)
    partner_id = Column(Integer, ForeignKey("partners.id"), nullable=True)
    action = Column(String(100))
    path = Column(String(255))
    method = Column(String(10))
    ip = Column(String(50))
    status_code = Column(Integer)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    partner = relationship("Partner", back_populates="audit_logs")
