from sqlalchemy import text
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.partner import Partner
from app.core.security import get_password_hash

def create_sequences_if_not_exists():
    sequences = [
        "partner_id_seq",
        "interconn_id_seq",
        "audit_log_id_seq",
        "snapshot_job_id_seq",
        "snapshot_data_id_seq"
    ]
    
    with engine.connect() as conn:
        for seq in sequences:
            try:
                # Check if sequence exists
                check_query = text(f"SELECT COUNT(*) FROM all_sequences WHERE sequence_name = '{seq.upper()}'")
                result = conn.execute(check_query).scalar()
                
                if result == 0:
                    print(f"Creating sequence {seq}...")
                    conn.execute(text(f"CREATE SEQUENCE {seq} START WITH 1 INCREMENT BY 1"))
                    conn.commit()
                else:
                    print(f"Sequence {seq} already exists.")
            except Exception as e:
                print(f"Error checking/creating sequence {seq}: {e}")

def init_db():
    print("Ensuring sequences exist...")
    create_sequences_if_not_exists()
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Check if admin exists
    admin = db.query(Partner).filter(Partner.api_key == "admin").first()
    if not admin:
        print("Creating admin user...")
        admin = Partner(
            name="Administrator Nasional",
            api_key="admin",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            quota_daily=999999
        )
        db.add(admin)
    
    # Check if demo partner exists
    partner = db.query(Partner).filter(Partner.api_key == "partner1").first()
    if not partner:
        print("Creating demo partner...")
        partner = Partner(
            name="Dinas Kesehatan Kota",
            api_key="partner1",
            hashed_password=get_password_hash("partner123"),
            role="partner",
            quota_daily=100
        )
        db.add(partner)
        
    db.commit()
    db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized successfully.")
