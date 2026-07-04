from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL   = os.getenv("MONGODB_URL",   "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "tripsmart")

client = None
db     = None

async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db     = client[DATABASE_NAME]
        await client.admin.command("ping")
        print("✅ Connected to MongoDB successfully")
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print("   Running without database (in-memory mode)")
        db = None

async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    return db