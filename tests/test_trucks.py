# tests/test_trucks.py
import json
from tests.base import BaseTestCase
from models.tables import Truck
from models import storage

class TestTrucks(BaseTestCase):
    """Tests for the trucks endpoints."""

    def test_create_truck(self):
        """Test creating a new truck."""
        truck_data = {
            "truck_number": "TRUCK-001",
            "capacity_cubic_meters": 100.0
        }
        response = self.client.post('/api/v1/trucks/', data=json.dumps(truck_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['truck_number'], 'TRUCK-001')

    def test_get_trucks(self):
        """Test getting all trucks."""
        # First, create a truck to ensure there is data
        truck = Truck(truck_number="TRUCK-002")
        storage.new(truck)
        storage.save()

        response = self.client.get('/api/v1/trucks/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_get_truck(self):
        """Test getting a single truck."""
        truck = Truck(truck_number="TRUCK-003")
        storage.new(truck)
        storage.save()

        response = self.client.get(f'/api/v1/trucks/{truck.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['truck_number'], 'TRUCK-003')

    def test_get_non_existent_truck(self):
        """Test getting a truck that does not exist."""
        response = self.client.get('/api/v1/trucks/non-existent-id')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
