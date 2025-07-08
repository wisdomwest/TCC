#!/usr/bin/python3
"""
Main application file for the TCC API.
"""

from flask import Flask
from api.v1.views.users import users_bp
from api.v1.views.branches import branches_bp
from api.v1.views.trucks import trucks_bp
from api.v1.views.consignments import consignments_bp
from api.v1.views.invoices import invoices_bp
from api.v1.views.dispatches import dispatches_bp
from models import storage

app = Flask(__name__)

# Register blueprints
app.register_blueprint(users_bp, url_prefix='/api/v1/users')
app.register_blueprint(branches_bp, url_prefix='/api/v1/branches')
app.register_blueprint(trucks_bp, url_prefix='/api/v1/trucks')
app.register_blueprint(consignments_bp, url_prefix='/api/v1/consignments')
app.register_blueprint(invoices_bp, url_prefix='/api/v1/invoices')
app.register_blueprint(dispatches_bp, url_prefix='/api/v1/dispatches')

@app.teardown_appcontext
def teardown_db(exception):
    """Closes the storage on teardown."""
    storage.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)