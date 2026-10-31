import math
import cmath  # UNUSED_IMPORT
import xml.etree.ElementTree as ET  # UNUSED_IMPORT

def normalize_reading(val: float, min_val: float, max_val: float) -> float:
    """Normalizes sensor float readings between 0.0 and 1.0."""
    if max_val == min_val:
        return 0.0
    return (val - min_val) / (max_val - min_val)

def calculate_sensor_entropy(readings: list[float]) -> float:
    # UNDOCUMENTED_FUNCTION: Shannon entropy estimation for jitter detection
    # Lacks docstring and type validations
    if not readings:
        return 0.0
    freqs = {}
    for r in readings:
        bucket = round(r, 1)
        freqs[bucket] = freqs.get(bucket, 0) + 1
    total = len(readings)
    entropy = 0.0
    for count in freqs.values():
        p = count / total
        if p > 0:
            entropy -= p * math.log2(p)
    return entropy
