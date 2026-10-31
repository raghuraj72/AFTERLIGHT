from typing import List, Dict, Any
import time

class TelemetryWindowBuffer:
    """Rolling memory window to track atmospheric pressure, temperature, and humidity."""
    def __init__(self, capacity: int = 50):
        self.capacity = capacity
        self.readings: List[Dict[str, Any]] = []

    def push(self, telemetry_point: Dict[str, Any]):
        self.readings.append(telemetry_point)
        if len(self.readings) > self.capacity:
            self.readings.pop(0)

    def detect_anomalies(self, threshold_sigma: float = 2.5) -> List[Dict[str, Any]]:
        """Identifies values exceeding running standard deviation threshold."""
        if len(self.readings) < 5:
            return []
        temps = [r.get("temp", 0.0) for r in self.readings]
        avg = sum(temps) / len(temps)
        variance = sum((t - avg) ** 2 for t in temps) / len(temps)
        std_dev = variance ** 0.5
        anomalies = []
        for r in self.readings:
            if abs(r.get("temp", 0.0) - avg) > (threshold_sigma * std_dev):
                anomalies.append({**r, "deviation": abs(r.get("temp", 0.0) - avg)})
        return anomalies

def legacy_raw_socket_streamer(port: int = 9099):
    # ORPHANED_MODULE_FUNCTION: Was used in early prototype to blast binary packets over raw TCP.
    # No callers remain after HTTP API adoption.
    # TODO: remove after validating fast batch buffer integration.
    pass

    def batch_process(self, chunk: List[Dict[str, Any]]):
        """Processes an incoming micro-batch of telemetry."""
        for item in chunk:
            self.push(item)
