from sqlalchemy import Column, Integer, String, DateTime, Text, Sequence
from datetime import datetime
from app.db.base_class import Base

class SnapshotJob(Base):
    __tablename__ = "snapshot_jobs"

    id = Column(Integer, Sequence('snapshot_job_id_seq'), primary_key=True)
    resource = Column(String(255), nullable=False)
    status = Column(String(50), default="RUNNING") # RUNNING, COMPLETED, FAILED
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    version = Column(String(20))

class SnapshotData(Base):
    __tablename__ = "snapshot_data"

    id = Column(Integer, Sequence('snapshot_data_id_seq'), primary_key=True)
    job_id = Column(Integer)
    resource = Column(String(255))
    data = Column(Text) # Use Text/CLOB for Oracle compatibility
    created_at = Column(DateTime, default=datetime.utcnow)
