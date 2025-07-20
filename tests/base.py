# tests/base.py
import unittest
from api.v1.app import app
from models import storage
from models.base_model import Base


class BaseTestCase(unittest.TestCase):
    """Base TestCase for all tests."""

    def setUp(self):
        """Set up the test client and database."""
        app.config['TESTING'] = True
        self.client = app.test_client()
        storage.reload()

    def tearDown(self):
        """Tear down the database."""
        storage.close()
        Base.metadata.drop_all(storage._DBStorage__engine)
