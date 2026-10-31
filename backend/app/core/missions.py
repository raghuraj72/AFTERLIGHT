from typing import List
from ..models.schemas import GhostHuntMission, GhostCodeFinding

def generate_ghost_hunt_missions(findings: List[GhostCodeFinding]) -> List[GhostHuntMission]:
    missions = []
    
    # 1. The Mystery of the Broken Vault
    crypto = next((f for f in findings if f.type == "deprecated_crypto"), None)
    if crypto:
        missions.append(GhostHuntMission(
            id="GH-01",
            title="The Mystery of the Broken Hash",
            difficulty="Novice",
            description="A cryptographic relic from the past remains active in the authentication pipeline. Investigate the security vulnerability and trace the file where it resides.",
            clue="Inspect backend/auth_legacy.py for hash functions commonly broken by collision attacks (MD5/SHA1).",
            target_finding_id=crypto.id,
            completed=False,
            badge="Cryptographic Sleuth"
        ))

    # 2. The Lost Ingestion Streamer
    orphaned = next((f for f in findings if f.type == "orphaned_function"), None)
    if orphaned:
        missions.append(GhostHuntMission(
            id="GH-02",
            title="The Forgotten Socket Streamer",
            difficulty="Adept",
            description="During a historical refactor, an entire raw socket function was orphaned. Find the abandoned function that has zero remaining callers.",
            clue="Search pipeline.py for functions declared with 'def legacy_' that are never invoked by server.py.",
            target_finding_id=orphaned.id,
            completed=False,
            badge="Architecture Detective"
        ))

    # 3. The CVE Phantom
    dep = next((f for f in findings if f.type == "deprecated_dependency" and f.severity == "high"), None)
    if dep:
        missions.append(GhostHuntMission(
            id="GH-03",
            title="The Vulnerable Dependency Phantom",
            difficulty="Master",
            description="A package in requirements.txt is severely outdated and exposes the application to TLS vulnerabilities.",
            clue="Look for a major HTTP transport library pinned to version 1.25.x.",
            target_finding_id=dep.id,
            completed=False,
            badge="Vulnerability Exorcist"
        ))

    # 4. The Unverified Core
    missing_test = next((f for f in findings if f.type == "missing_test"), None)
    if missing_test:
        missions.append(GhostHuntMission(
            id="GH-04",
            title="The Unshielded Anomaly Heuristic",
            difficulty="Adept",
            description="A critical API route computes statistical anomalies for weather stations without a single automated unit test.",
            clue="Inspect server.py endpoints for missing test harnesses in tests/.",
            target_finding_id=missing_test.id,
            completed=False,
            badge="Guardian of Code"
        ))

    return missions
