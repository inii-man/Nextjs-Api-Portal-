from typing import Any, List
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.snapshot import SnapshotJob, SnapshotData
from app.models.partner import Partner
from datetime import datetime

router = APIRouter()

@router.get("/jobs", response_model=List[dict])
def list_snapshot_jobs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Partner = Depends(deps.get_current_active_user)
):
    jobs = db.query(SnapshotJob).order_by(SnapshotJob.started_at.desc()).offset(skip).limit(limit).all()
    return [
        {
            "id": j.id,
            "resource": j.resource,
            "status": j.status,
            "version": j.version,
            "started_at": j.started_at.isoformat() if j.started_at else None,
            "finished_at": j.finished_at.isoformat() if j.finished_at else None,
        }
        for j in jobs
    ]

# Simulated snapshot generation
def generate_snapshot_data(db: Session, job_id: int, resource: str):
    # Simulate processing time
    # In real world, this would fetch data from other Oracle tables
    demo_data = [
        {"id": 1, "name": f"Item 1 from {resource}", "status": "Active"},
        {"id": 2, "name": f"Item 2 from {resource}", "status": "Inactive"}
    ]
    
    snapshot_entry = SnapshotData(
        job_id=job_id,
        resource=resource,
        data=json.dumps(demo_data) # Serialize for Text/CLOB column
    )
    db.add(snapshot_entry)
    
    job = db.query(SnapshotJob).filter(SnapshotJob.id == job_id).first()
    if job:
        job.status = "COMPLETED"
        job.finished_at = datetime.utcnow()
    
    db.commit()

@router.post("/run", response_model=dict)
def run_snapshot(
    resource: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: Partner = Depends(deps.get_current_active_user)
):
    # Basic Quota Check
    if current_user.quota_used >= current_user.quota_daily:
        raise HTTPException(status_code=429, detail="Quota exceeded")
    
    # Create Job
    job = SnapshotJob(resource=resource, version="v1.0")
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Increment Quota
    current_user.quota_used += 1
    db.commit()
    
    # Run simulation in background
    background_tasks.add_task(generate_snapshot_data, db, job.id, resource)
    
    return {"job_id": job.id, "status": "RUNNING", "message": "Snapshot job started"}

@router.get("/status/{job_id}", response_model=dict)
def get_snapshot_status(
    job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: Partner = Depends(deps.get_current_active_user)
):
    job = db.query(SnapshotJob).filter(SnapshotJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job.id, "status": job.status, "finished_at": job.finished_at}

@router.get("/data/{job_id}", response_model=List[dict])
def get_snapshot_data(
    job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: Partner = Depends(deps.get_current_active_user)
):
    data_entry = db.query(SnapshotData).filter(SnapshotData.job_id == job_id).first()
    if not data_entry:
        raise HTTPException(status_code=404, detail="Data not found or job still running")
    
    return json.loads(data_entry.data) # Deserialize from Text/CLOB
