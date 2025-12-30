import os 
import sqlalchemy
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from fastapi import FastAPI, Depends, Response, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import shortuuid
from typing import List, Dict, Any
from dotenv import load_dotenv
load_dotenv()

# DATABASE SETUP
DATABASE_URL = os.getenv("DATABASE_URL")

engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"connect_timeout": 10})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



# DATABASE MODEL

class Profile(Base):
    __tablename__ = "profiles"

    id = sqlalchemy.Column(sqlalchemy.String, primary_key=True, index=True)
    name = sqlalchemy.Column(sqlalchemy.String, index=True)
    fields = sqlalchemy.Column(JSONB)


# Initialize database on first startup
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not initialize database: {e}")


# FASTAPI APP
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pydantic Models
class FieldModel(BaseModel):
    type: str
    value: str

class ProfileCreate(BaseModel):
    name: str
    fields: List[FieldModel]

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API ENDPOINTS

@app.post("/api/create-profile")
def create_profile(profile_data: ProfileCreate, db: Session = Depends(get_db)):
    new_id = shortuuid.uuid()



    fields_data = [field.dict() for field in profile_data.fields]

    new_profile = Profile(
        id=new_id,
        name=profile_data.name,
        fields=fields_data 
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return {"profile_id": new_id}


@app.get("/api/profile/{profile_id}")
def get_profile(profile_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return profile


@app.get("/api/profile/{profile_id}/vcard")
def generate_vcard(profile_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    phone = next((field['value'] for field in profile.fields if field['type'] == 'phone'), None)
    email = next((field['value'] for field in profile.fields if field['type'] == 'email'), None)
    website = next((field['value'] for field in profile.fields if field['type'] == 'website'), None)

    vcard_string = f"""BEGIN:VCARD
VERSION:3.0
N:{profile.name.split(" ")[-1] if ' ' in profile.name else profile.name};{profile.name.split(" ")[0] if ' ' in profile.name else ''}
FN:{profile.name}
{f"TEL;TYPE=CELL:{phone}" if phone else ""}
{f"EMAIL:{email}" if email else ""}
{f"URL;TYPE=Website:{website}" if website else ""}
END:VCARD"""
    
    return Response(
        content=vcard_string,
        media_type="text/vcard",
        headers={"Content-Disposition": f"attachment; filename={profile.name}.vcf"}
    )
