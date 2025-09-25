"""
Database module providing creation, validation, retry logic, and in-memory async collections.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any, Dict, Optional, Union

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

    async def __aexit__(self, exc_type: Optional[type], exc: Optional[BaseException], tb: Optional[Any]) -> None:  # noqa: D401
        self._lock.release()

    def _insert_one_unlocked(self, doc: Dict[str, Any]) -> None:
        """Internal helper for insert_one without locking."""
        _id = doc.get("_id")
        if _id is None:
            raise ValueError("_id is required for in-memory insert_one")
        key = str(_id)
        if key in self._data:
            raise ValueError(f"Document with _id '{key}' already exists")
        # Clone to avoid mutation
        self._data[key] = dict(doc)

    def _find_one_unlocked(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Internal helper for find_one without locking."""
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

    def _update_one_unlocked(self, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        """Internal helper for update_one without locking."""
        doc = self._find_one_unlocked(query)
        if not doc:
            return 0
        key = str(doc["_id"])
        # Support {"$set": {...}}
        if "$set" in update:
            for k, v in update["$set"].items():
                self._data[key][k] = v
        else:
            # Replace
            replacement = dict(update)
            replacement["_id"] = doc["_id"]  # Preserve _id
            self._data[key] = replacement
        return 1

    def _delete_one_unlocked(self, query: Dict[str, Any]) -> int:
        """Internal helper for delete_one without locking."""
        doc = self._find_one_unlocked(query)
        if not doc:
            return 0
        key = str(doc["_id"])
        self._data.pop(key, None)
        return 1

    async def insert_one(self, doc: Dict[str, Any]) -> None:
        async with self._lock:
            self._insert_one_unlocked(doc)

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        async with self._lock:
            return self._find_one_unlocked(query)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        async with self._lock:
            return self._update_one_unlocked(query, update)

    async def delete_one(self, query: Dict[str, Any]) -> int:
        async with self._lock:
            return self._delete_one_unlocked(query)

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


async def _create_mongo_client(
    settings: DatabaseSettings, *, max_attempts: int = 5, base_delay: float = 0.5
) -> MongoClientWrapper:
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
                appName="PhoenixRooivalk",
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
            await asyncio.sleep(delay)
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

    def get_db(self) -> Union[InMemoryDatabase, Any]:  # pymongo.database.Database
        if self._settings.use_in_memory_db:
            if not self._memory:
                _logger.info("using_in_memory_db", extra={"db": self._settings.db_name, "env": self._settings.environment})
                self._memory = InMemoryDatabase(self._settings.db_name)
            return self._memory
        # Real DB (synchronous facade)
        if not self._mongo:
            # If we're in an async context, instruct callers to use get_db_async()
            try:
                asyncio.get_running_loop()
            except RuntimeError:
                # No running loop; safe to block and run async client creation
                self._mongo = asyncio.run(_create_mongo_client(self._settings))
            else:
                # Running loop detected
                raise RuntimeError(
                    "get_db() called from an async context. Use 'await DatabaseProvider.get_db_async()' instead."
                )
        return self._mongo.db

    async def get_db_async(self) -> Union[InMemoryDatabase, Any]:  # pymongo.database.Database
        if self._settings.use_in_memory_db:
            if not self._memory:
                _logger.info("using_in_memory_db", extra={"db": self._settings.db_name, "env": self._settings.environment})
                self._memory = InMemoryDatabase(self._settings.db_name)
            return self._memory
        # Real DB
        if not self._mongo:
            self._mongo = await _create_mongo_client(self._settings)
        return self._mongo.db
