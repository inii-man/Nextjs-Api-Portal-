from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.partner import Partner
from app.models.interconnection import InterconnectionRequest
from app.schemas.interconnection import Interconnection, InterconnectionCreate

router = APIRouter()

@router.post("/", response_model=Interconnection)
def create_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: InterconnectionCreate,
    current_user: Partner = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = InterconnectionRequest(
        partner_id=current_user.id,
        requested_resource=request_in.requested_resource,
        purpose=request_in.purpose,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[Interconnection])
def read_requests(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Partner = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role == "admin":
        requests = db.query(InterconnectionRequest).offset(skip).limit(limit).all()
    else:
        requests = db.query(InterconnectionRequest).filter(
            InterconnectionRequest.partner_id == current_user.id
        ).offset(skip).limit(limit).all()
    return requests
