from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Conditional connect_args for SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        settings.DATABASE_URL, 
        connect_args=connect_args
    )
else:
    # For PostgreSQL with SSL (like Neon), use NullPool to avoid connection issues
    connect_args = {
        "connect_timeout": 30,  # Increased timeout for slow networks
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
        "options": "-c timezone=utc"
    }
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,  # Verify connections before using them
        pool_recycle=300,    # Recycle connections after 5 minutes
        poolclass=NullPool   # Disable connection pooling to avoid SSL issues
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)