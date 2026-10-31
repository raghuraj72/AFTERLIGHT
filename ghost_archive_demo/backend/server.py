from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from .pipeline import TelemetryWindowBuffer
from .auth_legacy import verify_station_token, compute_legacy_session_digest

app = FastAPI(title="ChronoLog Edge Ingest", version="0.4.1")
buffer = TelemetryWindowBuffer(capacity=100)

class TelemetryPayload(BaseModel):
    station_id: str
    timestamp: float
    temperature: float
    humidity: float
    barometric_pressure: float

@app.get("/health")
def health():
    return {"status": "alive", "engine": "ChronoLog-0.4.1"}

@app.post("/api/v1/telemetry/ingest")
def ingest_telemetry(payload: TelemetryPayload, x_station_token: Optional[str] = Header(None)):
    if not x_station_token or not verify_station_token(x_station_token, "EDGE_SECRET_KEY_PROD_1"):
        raise HTTPException(status_code=401, detail="Unauthorized edge station")
    data = payload.dict()
    buffer.push(data)
    return {"accepted": True, "buffered_count": len(buffer.readings)}

@app.get("/api/v1/telemetry/anomalies")
def get_anomalies():
    # MISSING_TEST: No unit test exists for anomaly detection threshold logic!
    return {"anomalies": buffer.detect_anomalies()}
