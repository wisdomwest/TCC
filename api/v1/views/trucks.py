#!/usr/bin/python3
"""
Contains the API endpoints for managing trucks.
"""

from flask import Blueprint, request, jsonify
from models.tables import Truck, TruckStatus
from models import storage
from datetime import timedelta

trucks_bp = Blueprint('trucks_bp', __name__)

@trucks_bp.route('/', methods=['POST'])
def create_truck():
    """
    Creates a new truck.

    ---
    parameters:
        - name: truck_number
          in: body
          type: string
          required: true
          description: The unique number of the truck.
        - name: capacity_cubic_meters
          in: body
          type: float
          required: false
          default: 500.0
          description: The capacity of the truck in cubic meters.
        - name: current_branch_id
          in: body
          type: string
          required: false
          description: The ID of the branch where the truck is currently located.
    responses:
        201:
            description: Truck created successfully.
            
        400:
            description: Missing required truck number.
    """
    data = request.get_json()
    if not data or not data.get('truck_number'):
        return jsonify({"error": "Missing truck number"}), 400

    new_truck = Truck(
        truck_number=data['truck_number'],
        capacity_cubic_meters=data.get('capacity_cubic_meters', 500.0),
        current_branch_id=data.get('current_branch_id')
    )
    storage.new(new_truck)
    storage.save()
    return jsonify(new_truck.to_dict()), 201

@trucks_bp.route('/', methods=['GET'])
def get_trucks():
    """
    Retrieves all trucks.

    ---
    responses:
        200:
            description: A list of all trucks.
            
    """
    trucks = storage.all(Truck).values()
    return jsonify([truck.to_dict() for truck in trucks])

@trucks_bp.route('/<truck_id>', methods=['GET'])
def get_truck(truck_id):
    """
    Retrieves a specific truck.
    ---
    parameters:
        - name: truck_id
          in: path
          type: string
          required: true
          description: The ID of the truck to retrieve.
    responses:
        200:
            description: The requested truck.
            
        404:
            description: Truck not found.
    """
    truck = storage.get(Truck, id=truck_id)
    if not truck:
        return jsonify({"error": "Truck not found"}), 404
    return jsonify(truck.to_dict())

@trucks_bp.route('/<truck_id>', methods=['PUT'])
def update_truck(truck_id):
    """
    Updates a truck's status or location
    ---
    parameters:
        - name: truck_id
          in: path
          type: string
          required: true
          description: The ID of the truck to update.
        - name: status
          in: body
          type: string
          required: false
          description: The new status of the truck (e.g., IDLE, IN_TRANSIT).
        - name: current_branch_id
          in: body
          type: string
          required: false
          description: The ID of the branch where the truck is currently located.
    responses:
        200:
            description: Truck updated successfully.
            
        404:
            description: Truck not found.
        400:
            description: No data provided or invalid data.
    """
    truck = storage.get(Truck, id=truck_id)
    if not truck:
        return jsonify({"error": "Truck not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if 'status' in data:
        truck.status = TruckStatus(data['status'])
    if 'current_branch_id' in data:
        truck.current_branch_id = data['current_branch_id']
    
    storage.save()
    return jsonify(truck.to_dict())

@trucks_bp.route('/status', methods=['GET'])
def get_truck_statuses():
    """
    Retrieves the status of all trucks.

    ---
    parameters:
        - name: status
          in: query
          type: string
          required: false
          description: Filter trucks by status
    responses:
        200:
            description: A list of all trucks with their statuses.
            
    """
    trucks = storage.all(Truck).values()
    return jsonify([{"id": truck.id, "truck_number": truck.truck_number, "status": truck.status.value} for truck in trucks])

@trucks_bp.route('/usage', methods=['GET'])
def get_truck_usage():
    """
    Retrieves the usage of all trucks over a given period.
    ---
    parameters:
      - name: days
        in: query
        type: integer
        required: false
        default: 7
        description: The number of days to look back for usage statistics.
    responses:
        200:
            description: A list of trucks with their usage statistics.
            
    """
    days = request.args.get('days', 7, type=int)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    trucks = storage.all(Truck).values()
    truck_usage = []
    for truck in trucks:
        dispatches = [d for d in truck.dispatches if start_date <= d.created_at <= end_date]
        truck_usage.append({
            "truck_id": truck.id,
            "truck_number": truck.truck_number,
            "dispatch_count": len(dispatches)
        })

    return jsonify(truck_usage)

@trucks_bp.route('/average_idle_time', methods=['GET'])
def get_average_idle_time():
    """
    Calculates the average idle time for trucks.
    ---
    responses:
      200:
        description: The average idle time of trucks in seconds.
    """
    trucks = storage.all(Truck).values()
    total_idle_time = timedelta()
    total_trucks = 0

    for truck in trucks:
        # This is a simplified calculation. A more accurate calculation would
        # require tracking the history of truck status changes.
        if truck.status == TruckStatus.IDLE:
            # Assuming the truck has been idle since its last dispatch
            last_dispatch = max(d.created_at for d in truck.dispatches) if truck.dispatches else truck.created_at
            idle_time = datetime.utcnow() - last_dispatch
            total_idle_time += idle_time
            total_trucks += 1

    average_idle_time = total_idle_time / total_trucks if total_trucks > 0 else 0

    return jsonify({"average_idle_time_seconds": average_idle_time.total_seconds()})
