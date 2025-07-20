# tests/test_invoices.py
import json
from tests.base import BaseTestCase
from models.tables import Invoice, Consignment, Branch
from models import storage

class TestInvoices(BaseTestCase):
    """Tests for the invoices endpoints."""

    def setUp(self):
        """Set up test data."""
        super().setUp()
        branch = Branch(name="Test Branch")
        storage.new(branch)
        storage.save()
        self.consignment = Consignment(
            volume_cubic_meters=10.0,
            destination_address="123 Test St",
            sender_address="456 Test Ave",
            receiver_name="Test Receiver",
            origin_branch_id=branch.id
        )
        storage.new(self.consignment)
        storage.save()

    def test_get_invoices(self):
        """Test getting all invoices."""
        invoice = Invoice(consignment_id=self.consignment.id, amount=100.0)
        storage.new(invoice)
        storage.save()

        response = self.client.get('/api/v1/invoices/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_get_invoice(self):
        """Test getting a single invoice."""
        invoice = Invoice(consignment_id=self.consignment.id, amount=200.0)
        storage.new(invoice)
        storage.save()

        response = self.client.get(f'/api/v1/invoices/{invoice.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['amount'], 200.0)

    def test_get_non_existent_invoice(self):
        """Test getting an invoice that does not exist."""
        response = self.client.get('/api/v1/invoices/non-existent-id')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
