#!/usr/bin/python3
"""
Contains the API endpoints for managing consignments.
"""

from flask import Blueprint, request, jsonify
from models.tables import Consignment, Invoice, Branch, Truck, Dispatch, ConsignmentStatus, TruckStatus
from models import storage
from sqlalchemy import func
from datetime import datetime

consignments_bp = Blueprint('consignments_bp', __name__)

def calculate_charge(volume, destination):
    return volume * 100

@consignments_bp.route('/', methods=['POST'])
def create_consignment():
    """
    Creates a new consignment and an associated invoice.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            volume_cubic_meters:
              type: number
              format: float
            destination_address:
              type: string
            sender_address:
              type: string
            receiver_name:
              type: string
            origin_branch_id:
              type: string
    responses:
      201:
        description: Consignment created successfully, and an associated invoice with a calculated amount is generated.
      400:
        description: Missing required consignment data.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ['volume_cubic_meters', 'destination_address', 'sender_address', 'receiver_name', 'origin_branch_id']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    try:
        volume_cubic_meters = data['volume_cubic_meters']
        if volume_cubic_meters is None:
            return jsonify({"error": "volume_cubic_meters cannot be null."}), 400
        volume_cubic_meters = float(volume_cubic_meters)
    except ValueError:
        return jsonify({"error": "Invalid volume_cubic_meters. Must be a number."}), 400

    # Create the consignment
    new_consignment = Consignment(
        volume_cubic_meters=volume_cubic_meters,
        destination_address=data['destination_address'],
        sender_address=data['sender_address'],
        receiver_name=data['receiver_name'],
        origin_branch_id=data['origin_branch_id']
    )
    storage.new(new_consignment)
    storage.save()

    # Create the invoice
    charge = calculate_charge(new_consignment.volume_cubic_meters, new_consignment.destination_address)
    new_invoice = Invoice(
        consignment_id=new_consignment.id,
        amount=charge
    )
    storage.new(new_invoice)
    storage.save()

    # Check if the total volume for the destination is enough to dispatch a truck
    check_and_dispatch_truck(new_consignment.origin_branch_id, new_consignment.destination_address)

    return jsonify(new_consignment.to_dict()), 201

@consignments_bp.route('/', methods=['GET'])
def get_consignments():
    """
    Retrieves all consignments.
    ---
    responses:
      200:
        description: A list of all consignments.
    """
    consignments = storage.all(Consignment).values()
    return jsonify([consignment.to_dict() for consignment in consignments])

@consignments_bp.route('/<consignment_id>', methods=['GET'])
def get_consignment(consignment_id):
    """
    Retrieves a specific consignment.
    ---
    parameters:
      - name: consignment_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The requested consignment.
      404:
        description: Consignment not found.
    """
    consignment = storage.get(Consignment, id=consignment_id)
    if not consignment:
        return jsonify({"error": "Consignment not found"}), 404
    return jsonify(consignment.to_dict())

@consignments_bp.route('/status/<consignment_id>', methods=['GET'])
def get_consignment_status(consignment_id):
    """
    Retrieves the status of a specific consignment.
    ---
    parameters:
      - name: consignment_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The status of the consignment.
      404:
        description: Consignment not found.
    """
    consignment = storage.get(Consignment, id=consignment_id)
    if not consignment:
        return jsonify({"error": "Consignment not found"}), 404
    return jsonify({"status": consignment.status.value})

@consignments_bp.route('/stats', methods=['GET'])
def get_consignment_stats():
    """
    Retrieves consignment statistics.
    ---
    parameters:
      - name: destination
        in: query
        type: string
        required: true
        description: The destination to filter by.
    responses:
      200:
        description: Consignment statistics for the given destination.
      400:
        description: Missing destination.
    """
    destination = request.args.get('destination')
    if not destination:
        return jsonify({"error": "Missing destination"}), 400

    consignments = storage.all(Consignment, destination_address=destination).values()
    total_volume = sum(c.volume_cubic_meters for c in consignments)
    total_revenue = sum(c.invoice.amount for c in consignments if c.invoice)

    return jsonify({
        "destination": destination,
        "total_consignments": len(consignments),
        "total_volume": total_volume,
        "total_revenue": total_revenue
    })

@consignments_bp.route('/average_wait_time', methods=['GET'])
def get_average_wait_time():
    """
    Calculates the average waiting time for consignments.
    ---
    responses:
      200:
        description: The average waiting time for consignments in seconds.
    """
    consignments = storage.all(Consignment).values()
    total_wait_time = timedelta()
    dispatched_consignments = 0

    for consignment in consignments:
        if consignment.status != ConsignmentStatus.AWAITING_DISPATCH:
            dispatch_time = consignment.dispatch.created_at
            wait_time = dispatch_time - consignment.created_at
            total_wait_time += wait_time
            dispatched_consignments += 1
    
    average_wait_time = total_wait_time / dispatched_consignments if dispatched_consignments > 0 else 0

    return jsonify({"average_wait_time_seconds": average_wait_time.total_seconds()})

def check_and_dispatch_truck(branch_id, destination_address):
    """
    Checks if the total volume of consignments for a specific destination
    at a given branch is enough to dispatch a truck, and dispatches one if so.

    Args:
        branch_id (str): The ID of the origin branch.
        destination_address (str): The destination address for the consignments.
    """
    branch = storage.get(Branch, id=branch_id)
    if not branch:
        return

    # Get all consignments
    all_consignments = storage.all(Consignment).values()

    # Filter in Python
    consignments_for_destination = [
        c for c in all_consignments
        if c.origin_branch_id == branch_id and
            c.destination_address == destination_address and
            c.status == ConsignmentStatus.AWAITING_DISPATCH
    ]

    # Now compute the volume
    total_volume = sum(c.volume_cubic_meters for c in consignments_for_destination)

    if total_volume >= 500:
        all_trucks = storage.all(Truck).values()
        # Find an available truck at the branch
        available_truck = [
            truck for truck in all_trucks
            if truck.current_branch_id == branch_id and
            truck.status == TruckStatus.AVAILABLE
        ]
        if available_truck:
            available_truck = available_truck[0]
        else:
            # If no available truck, we cannot dispatch
            return

        if available_truck:
            # Create a new dispatch
            new_dispatch = Dispatch(
                truck_id=available_truck.id,
                destination_address=destination_address
            )
            storage.new(new_dispatch)
            storage.save()

            # Update consignments and truck
            for consignment in consignments_for_destination:
                consignment.dispatch_id = new_dispatch.id
                consignment.status = ConsignmentStatus.DISPATCHED
            available_truck.status = TruckStatus.IN_TRANSIT
            storage.save()
