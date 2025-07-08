#!/usr/bin/python3
"""
initialize the models package
"""
    
from models.engine.db import DBStorage

storage_t = "db"
storage = DBStorage()
