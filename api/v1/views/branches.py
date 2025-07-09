#!/usr/bin/python3
"""
Contains the API endpoints for managing branches.
"""

from flask import Blueprint, request, jsonify
from models.tables import Branch
from models import storage

branches_bp = Blueprint('branches_bp', __name__)

@branches_bp.route('/', methods=['POST'])
def create_branch():
    """
    Creates a new branch.

    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              description: The name of the branch.
            is_hq:
              type: boolean
              description: Whether the branch is a headquarters.

    responses:
      201:
        description: Branch created successfully.
      400:
        description: Missing branch name.
      500:
        description: Internal server error.
    """
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({"error": "Missing branch name"}), 400

    new_branch = Branch(
        name=data['name'],
        is_hq=data.get('is_hq', False)
    )
    storage.new(new_branch)
    storage.save()
    return jsonify(new_branch.to_dict()), 201

@branches_bp.route('/', methods=['GET'])
def get_branches():
    """
    Retrieves all branches.

    ---

    responses:
        200:
            description: A list of all branches.
        500:
            description: Internal server error.
    """
    branches = storage.all(Branch).values()
    return jsonify([branch.to_dict() for branch in branches])

@branches_bp.route('/<branch_id>', methods=['GET'])
def get_branch(branch_id):
    """
    Retrieves a specific branch.
    ---
    parameters:
      - name: branch_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The requested branch.
      404:
        description: Branch not found.
    """
    branch = storage.get(Branch, id=branch_id)
    if not branch:
        return jsonify({"error": "Branch not found"}), 404
    return jsonify(branch.to_dict())
