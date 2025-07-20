#!/usr/bin/python3
"""
Main application file for the TCC API.
"""

from flask import Flask, send_from_directory
from flasgger import Swagger
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.v1.views.auth import login_required, role_required
from api.v1.views.users import users_bp
from api.v1.views.branches import branches_bp
from api.v1.views.trucks import trucks_bp
from api.v1.views.consignments import consignments_bp
from api.v1.views.invoices import invoices_bp
from api.v1.views.dispatches import dispatches_bp
from models import storage
import os

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this in your application!
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})
Swagger(app)

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
    app.run(host="0.0.0.0", port=5000, debug=True)
