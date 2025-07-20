#!/usr/bin/python3
"""
Contains the database models for the logistics application.
"""

import sqlalchemy
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Float, Boolean, Enum
import enum
from models.base_model import BaseModel, Base

class UserRole(enum.Enum):
    STAFF = "staff"
    MANAGER = "manager"

class TruckStatus(enum.Enum):
    AVAILABLE = "available"
    IN_TRANSIT = "in_transit"
    IDLE = "idle"

class ConsignmentStatus(enum.Enum):
    AWAITING_DISPATCH = "awaiting_dispatch"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"


class User(BaseModel, Base):
    __tablename__ = 'users'
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STAFF)
    branch_id = Column(String(60), ForeignKey('branches.id'), nullable=False)

class Branch(BaseModel, Base):
    __tablename__ = 'branches'
    name = Column(String(100), nullable=False)
    is_hq = Column(Boolean, default=False)
    users = relationship('User', backref='branch', lazy=True)
    trucks = relationship('Truck', backref='current_branch', lazy=True)

class Truck(BaseModel, Base):
    __tablename__ = 'trucks'
    truck_number = Column(String(50), unique=True, nullable=False)
    capacity_cubic_meters = Column(Float, nullable=False, default=500.0)
    status = Column(Enum(TruckStatus), nullable=False, default=TruckStatus.AVAILABLE)
    current_branch_id = Column(String(60), ForeignKey('branches.id'), nullable=True)

class Consignment(BaseModel, Base):
    __tablename__ = 'consignments'
    volume_cubic_meters = Column(Float, nullable=False)
    destination_address = Column(String(255), nullable=False)
    sender_address = Column(String(255), nullable=False)
    receiver_name = Column(String(100), nullable=False)
    status = Column(Enum(ConsignmentStatus), nullable=False, default=ConsignmentStatus.AWAITING_DISPATCH)
    origin_branch_id = Column(String(60), ForeignKey('branches.id'), nullable=False)
    dispatch_id = Column(String(60), ForeignKey('dispatches.id'), nullable=True)
    invoice = relationship('Invoice', backref='consignment', uselist=False, lazy=True)

class Invoice(BaseModel, Base):
    __tablename__ = 'invoices'
    consignment_id = Column(String(60), ForeignKey('consignments.id'), unique=True, nullable=False)
    amount = Column(Float, nullable=False)

class Dispatch(BaseModel, Base):
    __tablename__ = 'dispatches'
    truck_id = Column(String(60), ForeignKey('trucks.id'), nullable=False)
    destination_address = Column(String(255), nullable=False) # Common destination for the load

    consignments = relationship('Consignment', backref='dispatch', lazy=True)
    truck = relationship('Truck', backref='dispatches')
