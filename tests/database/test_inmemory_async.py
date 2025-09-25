import asyncio
import unittest

from backend.server_modules.database import InMemoryDatabase


class TestInMemoryAsyncContextManager(unittest.IsolatedAsyncioTestCase):
    async def test_async_context_manager_and_lock(self):
        db = InMemoryDatabase("testdb")
        coll = db.get_collection("items")

        # Test that operations are properly serialized by the lock
        results = []

        async def writer_task():
            async with coll:
                results.append("writer-start")
                await coll.insert_one({"_id": "1", "v": 1})
                results.append("writer-end")

        async def reader_task():
            async with coll:
                results.append("reader-start")
                doc = await coll.find_one({"_id": "1"})
                results.append("reader-end")
                return doc

        # Start writer first, then reader
        writer_future = asyncio.create_task(writer_task())
        await asyncio.sleep(0)  # yield to ensure writer task starts
        reader_future = asyncio.create_task(reader_task())

        await writer_future
        doc = await reader_future

        # Verify serialization: writer must complete before reader starts
        writer_start_idx = results.index("writer-start")
        writer_end_idx = results.index("writer-end")
        reader_start_idx = results.index("reader-start")

        self.assertLess(writer_start_idx, writer_end_idx)
        self.assertLess(writer_end_idx, reader_start_idx)
        self.assertIsNotNone(doc)
        self.assertEqual(doc["_id"], "1")


if __name__ == "__main__":
    unittest.main()
