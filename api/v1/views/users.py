#!/usr/bin/python3
"""
Contains the API endpoints for managing users.
"""

from flask import Blueprint, request, jsonify
from models.tables import User, UserRole
from models import storage
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/register', methods=['POST'])
def register_user():
    """
    Registers a new user.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
            role:
              type: string
              enum: [ADMIN, STAFF]
            branch_id:
              type: string

    responses:
        201:
            description: User created successfully.
        400:
            description: Missing username or password.
        409:
            description: User already exists.
    """
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400

    if storage.get(User, username=data['username']):
        return jsonify({"error": "User already exists"}), 409

    password_hash = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        password_hash=password_hash,
        role=data.get('role', UserRole.STAFF),
        branch_id=data.get('branch_id')
    )
    storage.new(new_user)
    storage.save()
    return jsonify(new_user.to_dict()), 201

@users_bp.route('/login', methods=['POST'])
def login_user():
    """
    Logs in a user.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login successful.
      400:
        description: Missing username or password.
      401:
        description: Invalid username or password.
    """
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400

    user = storage.get(User, username=data['username'])
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    # In a real application, you would return a JWT token here
    return jsonify({"message": "Login successful", "user": user.to_dict()})
