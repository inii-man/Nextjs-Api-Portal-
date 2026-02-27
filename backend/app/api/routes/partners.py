from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.partner import Partner
from app.schemas.partner import Partner as PartnerSchema, PartnerCreate
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=List[PartnerSchema])
def read_partners(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Partner = Depends(deps.get_current_active_admin),
) -> Any:
    partners = db.query(Partner).offset(skip).limit(limit).all()
    return partners

@router.post("/", response_model=PartnerSchema)
def create_partner(
    *,
    db: Session = Depends(deps.get_db),
    partner_in: PartnerCreate,
    current_user: Partner = Depends(deps.get_current_active_admin),
) -> Any:
    partner = db.query(Partner).filter(Partner.api_key == partner_in.api_key).first()
    if partner:
        raise HTTPException(status_code=400, detail="Partner already exists")
    
    db_obj = Partner(
        name=partner_in.name,
        api_key=partner_in.api_key,
        hashed_password=get_password_hash(partner_in.password),
        quota_daily=partner_in.quota_daily,
        role="partner"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
