"""Pydantic schemas for NOAA-style climate reports."""

from pydantic import BaseModel


class StationInfoSchema(BaseModel):
    name: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    altitude: float | None = None


class ReportPeriodSchema(BaseModel):
    type: str
    year: int
    month: int | None = None


class ReportRowSchema(BaseModel):
    day: int | None = None
    month: int | None = None
    temp_avg: float | None = None
    temp_max: float | None = None
    temp_min: float | None = None
    dewpoint_avg: float | None = None
    dewpoint_max: float | None = None
    dewpoint_min: float | None = None
    humidity_avg: float | None = None
    pressure_avg: float | None = None
    wind_speed_avg: float | None = None
    wind_gust_max: float | None = None
    wind_dir_prevailing: str | None = None
    rain_total: float | None = None
    hdd: float | None = None
    cdd: float | None = None


class ReportSummarySchema(BaseModel):
    temp_avg: float | None = None
    temp_max: float | None = None
    temp_max_date: str | None = None
    temp_min: float | None = None
    temp_min_date: str | None = None
    rain_total: float | None = None
    rain_days: int | None = None
    wind_gust_max: float | None = None
    wind_gust_max_date: str | None = None
    wind_dir_prevailing: str | None = None
    hdd_total: float | None = None
    cdd_total: float | None = None


class ClimateReportSchema(BaseModel):
    station: StationInfoSchema
    period: ReportPeriodSchema
    rows: list[ReportRowSchema]
    summary: ReportSummarySchema
