"""
Database module providing creation, validation, retry logic, and in-memory async collections.
"""
from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional

from ..config.database import DatabaseSettings, ConfigError
from ..services.blockchain.logger import get_logger

_logger = get_logger("database")


# ---------------------------
# In-memory async collection
# ---------------------------
class InMemoryCollection:
    """
    Async in-memory collection with simple CRUD semantics.
    Implements an async context manager for cooperative usage in async code
    paths and a per-collection asyncio lock for concurrency control.
    """

    def __init__(self, name: str):
        self._name = name
        self._data: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def __aenter__(self) -> "InMemoryCollection":
        await self._lock.acquire()
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:  # noqa: D401
        self._lock.release()

    async def insert_one(self, doc: Dict[str, Any]) -> None:
        key = str(doc.get("_id"))
        if not key:
            raise ValueError("_id is required for in-memory insert_one")
        # Clone to avoid mutation
        self._data[key] = dict(doc)

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        key = str(query.get("_id"))
        if key and key in self._data:
            return dict(self._data[key])
        # Extremely naive filter for demo (supports equality on top-level keys)
        for v in self._data.values():
            match = True
            for k, qv in query.items():
                if v.get(k) != qv:
                    match = False
                    break
            if match:
                return dict(v)
        return None

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        doc = await self.find_one(query)
        if not doc:
            return 0
        key = str(doc["_id"])
        # Support {"$set": {...}}
        if "$set" in update:
            for k, v in update["$set"].items():
                self._data[key][k] = v
        else:
            # Replace
            self._data[key] = dict(update)
        return 1

    async def delete_one(self, query: Dict[str, Any]) -> int:
        doc = await self.find_one(query)
        if not doc:
            return 0
        key = str(doc["_id"])
        self._data.pop(key, None)
        return 1


class InMemoryDatabase:
    def __init__(self, name: str):
        self._name = name
        self._collections: Dict[str, InMemoryCollection] = {}

    def get_collection(self, name: str) -> InMemoryCollection:
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]


# ---------------------------
# Mongo client creation with retries and validation
# ---------------------------
@dataclass
class MongoClientWrapper:
    client: Any
    db: Any


def _create_mongo_client(settings: DatabaseSettings, *, max_attempts: int = 5, base_delay: float = 0.5) -> MongoClientWrapper:
    try:
        from pymongo import MongoClient, errors as pymongo_errors  # type: ignore
    except Exception as ex:  # pragma: no cover - dependency import issues
        raise ConfigError(f"pymongo is required for MongoDB connection: {ex}")

    if not settings.mongodb_uri:
        raise ConfigError("Missing MongoDB URI for real database configuration")

    attempt = 0
    last_err: Optional[Exception] = None
    while attempt < max_attempts:
        attempt += 1
        try:
            client = MongoClient(
                settings.mongodb_uri,
                serverSelectionTimeoutMS=settings.connect_timeout_ms,
                appname="PhoenixRooivalk",
            )
            # Force server selection
            client.admin.command("ping")
            db = client[settings.db_name]
            _logger.info(
                "mongo_connect_ok",
                extra={"db": settings.db_name, "attempt": attempt, "uri_prefix": settings.mongodb_uri[:12]},
            )
            return MongoClientWrapper(client=client, db=db)
        except (pymongo_errors.ServerSelectionTimeoutError, pymongo_errors.AutoReconnect) as ex:
            last_err = ex
            # Transient
            delay = min(8.0, base_delay * (2 ** (attempt - 1)))
            _logger.warning("mongo_connect_retry", extra={"attempt": attempt, "delay_s": delay, "error": str(ex)})
            time.sleep(delay)
        except Exception as ex:
            # Permanent
            _logger.error("mongo_connect_fail_permanent", extra={"attempt": attempt, "error": str(ex)})
            raise

    assert last_err is not None
    _logger.critical("mongo_connect_exhausted", extra={"attempts": attempt, "error": str(last_err)})
    raise last_err


# ---------------------------
# Public API
# ---------------------------
class DatabaseProvider:
    """DI-friendly provider to obtain a database handle based on settings."""

    def __init__(self, settings: DatabaseSettings):
        self._settings = settings
        self._mongo: Optional[MongoClientWrapper] = None
        self._memory: Optional[InMemoryDatabase] = None

    def get_db(self):  # -> Union[InMemoryDatabase, pymongo.database.Database]
        if self._settings.use_in_memory_db:
            if not self._memory:
                _logger.info("using_in_memory_db", extra={"db": self._settings.db_name, "env": self._settings.environment})
                self._memory = InMemoryDatabase(self._settings.db_name)
            return self._memory
        # Real DB
        if not self._mongo:
            self._mongo = _create_mongo_client(self._settings)
        return self._mongo.db
