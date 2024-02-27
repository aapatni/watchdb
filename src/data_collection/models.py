import datetime

from dotenv import load_dotenv
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Base class for all models
Base = declarative_base()


class QueuedPost(Base):
    __tablename__ = "queued_posts"
    post_id = Column(String, primary_key=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    author_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    comments = Column(String, nullable=False)
    processed = Column(Boolean, default=False)


class Watch(Base):
    __tablename__ = "watches"
    Brand = Column(String, primary_key=True)
    Reference_Number = Column(String, primary_key=True)
    Timestamp = Column(DateTime, primary_key=True)

    Model = Column(String, primary_key=False)
    Case_Material = Column(String, nullable=True)
    Case_Diameter = Column(Float, nullable=True)
    Case_Thickness = Column(Float, nullable=True)
    Lug_Width = Column(Float, nullable=True)
    Lug_to_Lug = Column(Float, nullable=True)
    Dial_Color = Column(String, nullable=True)
    Crystal_Type = Column(String, nullable=True)
    Water_Resistance = Column(String, nullable=True)
    Movement = Column(String, nullable=True)
    Caliber = Column(String, nullable=True)
    Movement_Type = Column(String, nullable=True)
    Power_Reserve = Column(String, nullable=True)
    Bracelet_Strap_Material = Column(String, nullable=True)
    Clasp_Type = Column(String, nullable=True)
    Product_Weight = Column(String, nullable=True)
    Features = Column(String, nullable=True)
    Price = Column(Float, nullable=True)
    Availability = Column(String, nullable=True)
    Photo_URL = Column(String, nullable=True)
    Merchant_Name = Column(String, nullable=True)
    Product_URL = Column(String, nullable=True)
