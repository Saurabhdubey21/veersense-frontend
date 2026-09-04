from sqlalchemy import Column, Integer, String
from database import Base


class Personnel(Base):
    __tablename__ = "personnel"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    service_id = Column(String, unique=True, nullable=False)
    rank = Column(String, nullable=False)
    department = Column(String, nullable=False)