from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import engine, Base, SessionLocal
import models


app = FastAPI()


# Pydantic model
class PersonnelCreate(BaseModel):
    name: str
    service_id: str
    rank: str
    department: str


# Create database tables
Base.metadata.create_all(bind=engine)


# Database session
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home
@app.get("/")
def home():
    return {
        "message": "VeerSense Backend is running!"
    }


# Backend status
@app.get("/api/status")
def status():
    return {
        "project": "VeerSense",
        "status": "online",
        "message": "Backend connected successfully"
    }


# GET all personnel
@app.get("/api/personnel")
def get_personnel(db=Depends(get_db)):
    personnel = db.query(models.Personnel).all()
    return personnel


# POST new personnel
@app.post("/api/personnel")
def create_personnel(
    personnel: PersonnelCreate,
    db=Depends(get_db)
):
    new_personnel = models.Personnel(
        name=personnel.name,
        service_id=personnel.service_id,
        rank=personnel.rank,
        department=personnel.department
    )

    db.add(new_personnel)
    db.commit()
    db.refresh(new_personnel)

    return new_personnel