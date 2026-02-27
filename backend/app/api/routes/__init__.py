from fastapi import APIRouter
from app.api.routes import auth, partners, interconnections, snapshot, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(partners.router, prefix="/partners", tags=["partners"])
api_router.include_router(interconnections.router, prefix="/interconnections", tags=["interconnections"])
api_router.include_router(snapshot.router, prefix="/snapshot", tags=["snapshot"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
