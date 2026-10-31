// ChronoLog UI entrypoint
const API_BASE = "/api/v1/telemetry";

export async function fetchLiveAnomalies() {
    try {
        const res = await fetch(`${API_BASE}/anomalies`);
        return await res.json();
    } catch (e) {
        console.error("Telemetry link lost", e);
        return [];
    }
}

export function renderObsoleteRadar(canvasElement, rawPoints) {
    // TODO: remove canvas fallback once WebGL feed stabilizes
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.fillStyle = '#00ff88';
    rawPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}
