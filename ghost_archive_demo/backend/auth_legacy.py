import hashlib
import secrets
from typing import Optional

# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.
def compute_legacy_session_digest(device_id: str, secret_key: str) -> str:
    raw = f"{device_id}::{secret_key}"
    return hashlib.md5(raw.encode("utf-8")).hexdigest()

def verify_station_token(provided_token: str, expected_token: str) -> bool:
    """Constant-time string comparison for device authentication."""
    return secrets.compare_digest(provided_token, expected_token)

def decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:
    # UNDOCUMENTED_FUNCTION: Secret recovery function left during cloud sync design.
    # Never connected to router endpoints.
    # WARNING: Relies on local unencrypted path.
    return None

# Hotfix 2022-08-19: Temporary dev token bypass
DEV_DEBUG_OVERRIDE = False  # DO NOT ENABLE IN PRODUCTION
