"""
Database configuration and validation for MongoDB or in-memory fallback.
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Optional


_MONGO_URI_RE = re.compile(r"^(mongodb(\+srv)?):\/\/", re.IGNORECASE)


@dataclass(frozen=True)
class DatabaseSettings:
    mongodb_uri: Optional[str]
    db_name: str
    use_in_memory_db: bool
    environment: str  # dev, test, prod
    connect_timeout_ms: int = 5000


class ConfigError(ValueError):
    pass


def _to_bool(val: Optional[str]) -> bool:
    if val is None:
        return False
    v = val.strip().lower()
    return v in {"1", "true", "yes", "on"}


def load_database_settings(*, environment: Optional[str] = None) -> DatabaseSettings:
    env = (environment or os.getenv("APP_ENV") or os.getenv("ENV") or "dev").lower()
    uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
    db_name = os.getenv("MONGODB_DB") or os.getenv("MONGO_DB") or "phoenixrooivalk"
    use_mem = _to_bool(os.getenv("USE_IN_MEMORY_DB"))

    # Validate URI format if provided
    if uri and not _MONGO_URI_RE.match(uri):
        raise ConfigError("Invalid MongoDB URI: must start with 'mongodb://' or 'mongodb+srv://'")

    # Environment-specific checks
    if env in {"prod", "production"}:
        if use_mem:
            raise ConfigError("In-memory DB is not allowed in production")
        if not uri:
            raise ConfigError("MONGODB_URI is required in production")

    return DatabaseSettings(
        mongodb_uri=uri,
        db_name=db_name,
        use_in_memory_db=use_mem and not uri,  # prefer real DB if URI present
        environment=env,
    )
