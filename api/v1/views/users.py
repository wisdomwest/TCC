#!/usr/bin/python3
"""
Contains the API endpoints for managing users.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from api.v1.views.auth import login_required, role_required
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

    all_users = storage.all(User).values()
    if any(user.username == data['username'] for user in all_users):
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

    all_users = storage.all(User).values()
    user = next((user for user in all_users if user.username == data['username']), None)
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role.value})
    return jsonify(access_token=access_token)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = storage.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


@users_bp.route('', methods=['GET'])
@jwt_required()
@role_required('ADMIN')
def get_users():
    """
    Retrieves all users.
    ---
    responses:
      200:
        description: A list of all users.
    """
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users])

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
@role_required('ADMIN')
def get_user(user_id):
    """
    Retrieves a specific user.
    ---
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The requested user.
      404:
        description: User not found.
    """
    user = storage.get(User, id=user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMIN')
def update_user(user_id):
    """
    Updates a user's information.
    ---
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            role:
              type: string
              enum: [ADMIN, STAFF]
            branch_id:
              type: string
    responses:
      200:
        description: User updated successfully.
      404:
        description: User not found.
      400:
        description: No data provided.
    """
    user = storage.get(User, id=user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if 'username' in data:
        user.username = data['username']
    if 'role' in data:
        user.role = UserRole(data['role'])
    if 'branch_id' in data:
        user.branch_id = data['branch_id']
    
    storage.save()
    return jsonify(user.to_dict())

@users_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMIN')
def delete_user(user_id):
    """
    Deletes a user.
    ---
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
    responses:
      204:
        description: User deleted successfully.
      404:
        description: User not found.
    """
    user = storage.get(User, id=user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    storage.delete(user)
    storage.save()
    return '', 204