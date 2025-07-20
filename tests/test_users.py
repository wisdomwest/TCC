# tests/test_users.py
import json
from tests.base import BaseTestCase
from models.tables import User, Branch
from models import storage
from werkzeug.security import generate_password_hash

class TestUsers(BaseTestCase):
    """Tests for the users endpoints."""

    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.branch = Branch(name="Test Branch")
        storage.new(self.branch)
        storage.save()

    def test_register_user(self):
        """Test registering a new user."""
        user_data = {
            "username": "testuser",
            "password": "password123",
            "branch_id": self.branch.id
        }
        response = self.client.post('/api/v1/users/register', data=json.dumps(user_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['username'], 'testuser')

    def test_register_duplicate_user(self):
        """Test registering a user with a duplicate username."""
        user = User(username="existinguser", password_hash=generate_password_hash("password"), branch_id=self.branch.id)
        storage.new(user)
        storage.save()

        user_data = {
            "username": "existinguser",
            "password": "password123"
        }
        response = self.client.post('/api/v1/users/register', data=json.dumps(user_data), content_type='application/json')
        self.assertEqual(response.status_code, 409)

    def test_login_user(self):
        """Test logging in a user."""
        password = "password123"
        user = User(
            username="loginuser",
            password_hash=generate_password_hash(password),
            branch_id=self.branch.id
        )
        storage.new(user)
        storage.save()

        login_data = {
            "username": "loginuser",
            "password": password
        }
        response = self.client.post('/api/v1/users/login', data=json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Login successful')

    def test_login_wrong_password(self):
        """Test logging in with a wrong password."""
        user = User(
            username="wrongpassuser",
            password_hash=generate_password_hash("password123"),
            branch_id=self.branch.id
        )
        storage.new(user)
        storage.save()

        login_data = {
            "username": "wrongpassuser",
            "password": "wrongpassword"
        }
        response = self.client.post('/api/v1/users/login', data=json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_login_non_existent_user(self):
        """Test logging in with a non-existent user."""
        login_data = {
            "username": "nosuchuser",
            "password": "password"
        }
        response = self.client.post('/api/v1/users/login', data=json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)


if __name__ == '__main__':
    unittest.main()
