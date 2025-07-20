#!/usr/bin/python3
"""
Contains authentication decorators and utilities.
"""

from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import storage
from models.tables import User, UserRole
from flask import jsonify

def login_required(fn):
    """Decorator to protect routes that require authentication."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Authentication required", "details": str(e)}), 401
    return wrapper

def role_required(role):
    """Decorator to protect routes that require a specific role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = storage.get(User, user_id)
            if not user or user.role.value.upper() != role.upper():
                return jsonify({"error": f"{role} access required"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


