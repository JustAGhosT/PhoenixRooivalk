import os
import unittest

from backend.config.database import load_database_settings, ConfigError


class TestDatabaseConfigValidation(unittest.TestCase):
    def setUp(self):
        self._env_backup = dict(os.environ)

    def tearDown(self):
        os.environ.clear()
        os.environ.update(self._env_backup)

    def test_invalid_uri_format_raises(self):
        os.environ["MONGODB_URI"] = "invalid://localhost:27017"
        with self.assertRaises(ConfigError):
            load_database_settings(environment="dev")

    def test_prod_requires_uri_and_disallows_in_memory(self):
        os.environ.pop("MONGODB_URI", None)
        os.environ["USE_IN_MEMORY_DB"] = "true"
        with self.assertRaises(ConfigError):
            load_database_settings(environment="prod")

    def test_dev_allows_in_memory_when_no_uri(self):
        os.environ.pop("MONGODB_URI", None)
        os.environ["USE_IN_MEMORY_DB"] = "true"
        settings = load_database_settings(environment="dev")
        self.assertTrue(settings.use_in_memory_db)
        self.assertIsNone(settings.mongodb_uri)

    def test_prefers_real_db_when_uri_present(self):
        os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
        os.environ["USE_IN_MEMORY_DB"] = "true"
        settings = load_database_settings(environment="dev")
        self.assertFalse(settings.use_in_memory_db)
        self.assertEqual(settings.mongodb_uri, "mongodb://localhost:27017")


if __name__ == "__main__":
    unittest.main()
