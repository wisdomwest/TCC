#!/usr/bin/python3
"""
Contains the API endpoints for managing dispatches.
"""

from flask import Blueprint, jsonify
from models.tables import Dispatch
from models import storage

dispatches_bp = Blueprint('dispatches_bp', __name__)

@dispatches_bp.route('/', methods=['GET'])
def get_dispatches():
    """
    Retrieves all dispatches.

    ---
    responses:
      200:
        description: A list of all dispatches.
    """
    dispatches = storage.all(Dispatch).values()
    return jsonify([dispatch.to_dict() for dispatch in dispatches])

@dispatches_bp.route('/<dispatch_id>', methods=['GET'])
def get_dispatch(dispatch_id):
    """
    Retrieves a specific dispatch.
    ---
    parameters:
      - name: dispatch_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The requested dispatch.
      404:
        description: Dispatch not found.
    """
    dispatch = storage.get(Dispatch, id=dispatch_id)
    if not dispatch:
        return jsonify({"error": "Dispatch not found"}), 404
    return jsonify(dispatch.to_dict())
