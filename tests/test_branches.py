# tests/test_branches.py
import json
from tests.base import BaseTestCase
from models.tables import Branch
from models import storage

class TestBranches(BaseTestCase):
    """Tests for the branches endpoints."""

    def test_create_branch(self):
        """Test creating a new branch."""
        branch_data = {
            "name": "Main Branch",
            "is_hq": True
        }
        response = self.client.post('/api/v1/branches/', data=json.dumps(branch_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['name'], 'Main Branch')
        self.assertTrue(data['is_hq'])

    def test_get_branches(self):
        """Test getting all branches."""
        # First, create a branch to ensure there is data
        branch = Branch(name="Second Branch")
        storage.new(branch)
        storage.save()

        response = self.client.get('/api/v1/branches/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_get_branch(self):
        """Test getting a single branch."""
        branch = Branch(name="Third Branch")
        storage.new(branch)
        storage.save()

        response = self.client.get(f'/api/v1/branches/{branch.id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['name'], 'Third Branch')

    def test_get_non_existent_branch(self):
        """Test getting a branch that does not exist."""
        response = self.client.get('/api/v1/branches/non-existent-id')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
