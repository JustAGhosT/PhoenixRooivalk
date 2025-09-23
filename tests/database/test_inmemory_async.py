import asyncio
import unittest

from backend.server_modules.database import InMemoryDatabase


class TestInMemoryAsyncContextManager(unittest.IsolatedAsyncioTestCase):
    async def test_async_context_manager_and_lock(self):
        db = InMemoryDatabase("testdb")
        coll = db.get_collection("items")

        # Two tasks attempting to use the collection concurrently should serialize via the lock
        order = []

        async def task_a():
            async with coll:
                order.append("a-start")
                await asyncio.sleep(0.05)
                await coll.insert_one({"_id": "1", "v": 1})
                order.append("a-end")

        async def task_b():
            async with coll:
                order.append("b-start")
                found = await coll.find_one({"_id": "1"})
                # During b, a has already inserted, so this should see the doc
                if found:
                    order.append("b-found")
                order.append("b-end")

        await asyncio.gather(task_a(), task_b())

        self.assertEqual(order[0], "a-start")
        self.assertIn("a-end", order)
        self.assertIn("b-start", order)
        self.assertIn("b-found", order)
        self.assertIn("b-end", order)


if __name__ == "__main__":
    unittest.main()
