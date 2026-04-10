from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, text

from app.models.base import Base


class LightningEvent(Base):
    __tablename__ = "lightning_events"

    timestamp = Column(DateTime(timezone=True), primary_key=True, nullable=False)
    station_id = Column(String, nullable=False, primary_key=True)
    new_strikes = Column(Integer, nullable=False)
    distance_km = Column(Float, nullable=True)
    cumulative_count = Column(Integer, nullable=False)
    filtered = Column(Boolean, nullable=False, server_default=text("false"))
