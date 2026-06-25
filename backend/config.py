import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

class Config:
    """Configuration settings"""
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'agency_dashboard')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

def get_mongo_client():
    """Get MongoDB client"""
    try:
        client = MongoClient(Config.MONGODB_URI)
        # Test connection
        client.admin.command('ismaster')
        print("✓ MongoDB connected successfully")
        return client
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        return None

def get_database():
    """Get database instance"""
    client = get_mongo_client()
    if client:
        return client[Config.DATABASE_NAME]
    return None

# Collection references
def get_collections():
    """Get all collections"""
    db = get_database()
    if db:
        return {
            'clients': db['clients'],
            'projects': db['projects'],
            'tasks': db['tasks'],
            'team': db['team'],
            'reports': db['reports']
        }
    return None
