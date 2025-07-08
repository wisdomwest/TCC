#!/usr/bin/python3
"""
Contains the API endpoints for managing invoices.
"""

from flask import Blueprint, jsonify
from models.tables import Invoice
from models import storage

invoices_bp = Blueprint('invoices_bp', __name__)

@invoices_bp.route('/', methods=['GET'])
def get_invoices():
    """
    Retrieves all invoices.
    """
    invoices = storage.all(Invoice).values()
    return jsonify([invoice.to_dict() for invoice in invoices])

@invoices_bp.route('/<invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    """
    Retrieves a specific invoice.
    ---
    parameters:
      - name: invoice_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: The requested invoice.
      404:
        description: Invoice not found.
    """
    invoice = storage.get(Invoice, id=invoice_id)
    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404
    return jsonify(invoice.to_dict())