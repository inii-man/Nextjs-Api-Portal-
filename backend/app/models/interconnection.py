from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Sequence
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class InterconnectionRequest(Base):
    __tablename__ = "interconnection_requests"

    id = Column(Integer, Sequence('interconn_id_seq'), primary_key=True)
    partner_id = Column(Integer, ForeignKey("partners.id"))
    requested_resource = Column(String(255), nullable=False)
    purpose = Column(Text)
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED
    requested_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)

    partner = relationship("Partner", back_populates="requests")
