# tests/test_consignments.py
import json
from tests.base import BaseTestCase
from models.tables import Consignment, Branch
from models import storage

class TestConsignments(BaseTestCase):
    """Tests for the consignments endpoints."""

    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.branch = Branch(name="Test Branch")
        storage.new(self.branch)
        storage.save()

    def test_create_consignment(self):
        """Test creating a new consignment."""
        consignment_data = {
            "volume_cubic_meters": 10.0,
            "destination_address": "123 Main St",
            "sender_address": "456 Oak Ave",
            "receiver_name": "John Doe",
            "origin_branch_id": self.branch.id
        }
        response = self.client.post('/api/v1/consignments/', data=json.dumps(consignment_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['destination_address'], '123 Main St')

    def test_get_consignments(self):
        """Test getting all consignments."""
        consignment = Consignment(
            volume_cubic_meters=5.0,
            destination_address="789 Pine Ln",
            sender_address="101 Maple Dr",
            receiver_name="Jane Smith",
            origin_branch_id=self.branch.id
        )
        storage.new(consignment)
        storage.save()

        response = self.client.get('/api/v1/consignments/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_get_consignment(self):
        """Test getting a single consignment."""
        consignment = Consignment(
            volume_cubic_meters=8.0,
            destination_address="212 Birch Rd",
            sender_address="313 Cedar Ct",
            receiver_name="Peter Jones",
            origin_branch_id=self.branch.id
        )
        storage.new(consignment)
        storage.save()

        response = self.client.get(f'/api/v1/consignments/{consignment.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['receiver_name'], 'Peter Jones')

    def test_get_consignment_status(self):
        """Test getting the status of a consignment."""
        consignment = Consignment(
            volume_cubic_meters=12.0,
            destination_address="414 Spruce St",
            sender_address="515 Elm St",
            receiver_name="Mary Miller",
            origin_branch_id=self.branch.id
        )
        storage.new(consignment)
        storage.save()

        response = self.client.get(f'/api/v1/consignments/status/{consignment.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('status', data)

    def test_get_consignment_stats(self):
        """Test getting consignment statistics."""
        consignment = Consignment(
            volume_cubic_meters=15.0,
            destination_address="Test Destination",
            sender_address="616 Pine St",
            receiver_name="James Wilson",
            origin_branch_id=self.branch.id
        )
        storage.new(consignment)
        storage.save()
        
        response = self.client.get('/api/v1/consignments/stats?destination=Test%20Destination')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['destination'], 'Test Destination')
        self.assertEqual(data['total_consignments'], 1)

    def test_get_average_wait_time(self):
        """Test getting the average wait time for consignments."""
        response = self.client.get('/api/v1/consignments/average_wait_time')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('average_wait_time_seconds', data)


if __name__ == '__main__':
    unittest.main()
