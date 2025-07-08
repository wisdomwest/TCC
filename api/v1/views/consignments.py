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

# Dummy charge calculation function
def calculate_charge(volume, destination):
    # In a real application, this would be a more complex calculation
    # based on distance, volume, etc.
    return volume * 10 # a sample charge of 10 per cubic meter

@consignments_bp.route('/', methods=['POST'])
def create_consignment():
    """
    Creates a new consignment and an associated invoice.
    """
    data = request.get_json()
    if not data or not all(k in data for k in ['volume_cubic_meters', 'destination_address', 'sender_address', 'receiver_name', 'origin_branch_id']):
        return jsonify({"error": "Missing required consignment data"}), 400

    # Create the consignment
    new_consignment = Consignment(
        volume_cubic_meters=data['volume_cubic_meters'],
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
    """
    consignments = storage.all(Consignment).values()
    return jsonify([consignment.to_dict() for consignment in consignments])

@consignments_bp.route('/<consignment_id>', methods=['GET'])
def get_consignment(consignment_id):
    """
    Retrieves a specific consignment.
    """
    consignment = storage.get(Consignment, id=consignment_id)
    if not consignment:
        return jsonify({"error": "Consignment not found"}), 404
    return jsonify(consignment.to_dict())

@consignments_bp.route('/status/<consignment_id>', methods=['GET'])
def get_consignment_status(consignment_id):
    """
    Retrieves the status of a specific consignment.
    """
    consignment = storage.get(Consignment, id=consignment_id)
    if not consignment:
        return jsonify({"error": "Consignment not found"}), 404
    return jsonify({"status": consignment.status.value})

@consignments_bp.route('/stats', methods=['GET'])
def get_consignment_stats():
    """
    Retrieves consignment statistics.
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

def check_and_dispatch_truck(branch_id, destination_address):
    """
    Checks if the total volume of consignments for a specific destination
    at a given branch is enough to dispatch a truck.
    """
    branch = storage.get(Branch, id=branch_id)
    if not branch:
        return

    consignments_for_destination = storage.all(Consignment, origin_branch_id=branch_id, destination_address=destination_address, status=ConsignmentStatus.AWAITING_DISPATCH).values()
    total_volume = sum(c.volume_cubic_meters for c in consignments_for_destination)

    if total_volume >= 500:
        available_truck = storage.get(Truck, current_branch_id=branch_id, status=TruckStatus.AVAILABLE)
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
