# tests/test_dispatches.py
import json
from tests.base import BaseTestCase
from models.tables import Dispatch, Truck
from models import storage

class TestDispatches(BaseTestCase):
    """Tests for the dispatches endpoints."""

    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.truck = Truck(truck_number="Test Truck")
        storage.new(self.truck)
        storage.save()

    def test_get_dispatches(self):
        """Test getting all dispatches."""
        dispatch = Dispatch(truck_id=self.truck.id, destination_address="123 Test St")
        storage.new(dispatch)
        storage.save()

        response = self.client.get('/api/v1/dispatches/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_get_dispatch(self):
        """Test getting a single dispatch."""
        dispatch = Dispatch(truck_id=self.truck.id, destination_address="456 Test Ave")
        storage.new(dispatch)
        storage.save()

        response = self.client.get(f'/api/v1/dispatches/{dispatch.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['destination_address'], '456 Test Ave')

    def test_get_non_existent_dispatch(self):
        """Test getting a dispatch that does not exist."""
        response = self.client.get('/api/v1/dispatches/non-existent-id')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
