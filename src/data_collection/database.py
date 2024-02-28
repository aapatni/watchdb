import os

from dotenv import load_dotenv
from models import Base
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_USERNAME = os.getenv("DB_USER")
DATABASE_PASSWORD = os.getenv("DB_PASSWORD")
DATABASE_HOST_URL = os.getenv("DB_HOST_URL")
DATABASE_PORT = os.getenv("DB_PORT")
sql_url = f"postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST_URL}:{DATABASE_PORT}/postgres"


engine = create_engine(sql_url, echo=False, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    with engine.connect() as conn:
        with conn.begin():
            Base.metadata.create_all(engine)


init_db()
