from fastapi       import APIRouter, HTTPException, status
from datetime      import datetime
from typing        import Optional, List
import random
import string

from models   import TripCreate, TripResponse, ShareRequest, ShareResponse
from database import get_db

router = APIRouter(prefix="/trips", tags=["trips"])

# In-memory store as fallback when MongoDB is not available
TRIPS_STORE: dict = {}

def generate_share_code(dest_name: str) -> str:
    prefix = dest_name[:3].upper() if dest_name else "TRP"
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{suffix}"

def trip_to_dict(trip_data: TripCreate, share_code: str) -> dict:
    now = datetime.utcnow()
    return {
        "destination": trip_data.destination,
        "tripDetails":  trip_data.tripDetails.model_dump(),
        "activities":   trip_data.activities,
        "budget":       trip_data.budget.model_dump(),
        "shareCode":    share_code,
        "isPublic":     trip_data.isPublic,
        "createdAt":    now,
        "updatedAt":    now,
    }

# ── Create Trip ──
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_trip(trip: TripCreate):
    share_code  = generate_share_code(trip.destination.get("name", "TRP"))
    trip_dict   = trip_to_dict(trip, share_code)
    db          = get_db()

    if db is not None:
        try:
            result      = await db.trips.insert_one(trip_dict)
            trip_dict["id"] = str(result.inserted_id)
        except Exception as e:
            print(f"DB error: {e}")
            trip_dict["id"] = share_code
    else:
        trip_dict["id"] = share_code
        TRIPS_STORE[share_code] = trip_dict

    return {
        "success":   True,
        "id":        trip_dict["id"],
        "shareCode": share_code,
        "shareLink": f"https://tripsmart.app/trip/{share_code}",
        "message":   "Trip created successfully",
    }

# ── Get All Trips ──
@router.get("/")
async def get_all_trips(limit: int = 20):
    db = get_db()
    if db is not None:
        try:
            cursor = db.trips.find().sort("createdAt", -1).limit(limit)
            trips  = []
            async for trip in cursor:
                trip["id"] = str(trip.pop("_id"))
                trips.append(trip)
            return {"success": True, "trips": trips, "count": len(trips)}
        except Exception as e:
            print(f"DB error: {e}")

    trips = list(TRIPS_STORE.values())
    return {"success": True, "trips": trips, "count": len(trips)}

# ── Get Trip by ID ──
@router.get("/{trip_id}")
async def get_trip(trip_id: str):
    db = get_db()
    if db is not None:
        try:
            from bson import ObjectId
            trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
            if trip:
                trip["id"] = str(trip.pop("_id"))
                return {"success": True, "trip": trip}
        except Exception:
            pass

    if trip_id in TRIPS_STORE:
        return {"success": True, "trip": TRIPS_STORE[trip_id]}

    raise HTTPException(status_code=404, detail="Trip not found")

# ── Get Trip by Share Code ──
@router.get("/share/{share_code}")
async def get_trip_by_code(share_code: str):
    db = get_db()
    if db is not None:
        try:
            trip = await db.trips.find_one({"shareCode": share_code})
            if trip:
                trip["id"] = str(trip.pop("_id"))
                return {"success": True, "trip": trip}
        except Exception as e:
            print(f"DB error: {e}")

    if share_code in TRIPS_STORE:
        return {"success": True, "trip": TRIPS_STORE[share_code]}

    raise HTTPException(status_code=404, detail="Trip not found")

# ── Update Trip ──
@router.put("/{trip_id}")
async def update_trip(trip_id: str, trip: TripCreate):
    db         = get_db()
    trip_dict  = trip_to_dict(trip, trip_id)
    trip_dict["updatedAt"] = datetime.utcnow()

    if db is not None:
        try:
            from bson import ObjectId
            result = await db.trips.update_one(
                {"_id": ObjectId(trip_id)},
                {"$set": trip_dict}
            )
            if result.modified_count:
                return {"success": True, "message": "Trip updated"}
        except Exception as e:
            print(f"DB error: {e}")

    if trip_id in TRIPS_STORE:
        TRIPS_STORE[trip_id].update(trip_dict)
        return {"success": True, "message": "Trip updated"}

    raise HTTPException(status_code=404, detail="Trip not found")

# ── Delete Trip ──
@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    db = get_db()
    if db is not None:
        try:
            from bson import ObjectId
            result = await db.trips.delete_one({"_id": ObjectId(trip_id)})
            if result.deleted_count:
                return {"success": True, "message": "Trip deleted"}
        except Exception as e:
            print(f"DB error: {e}")

    if trip_id in TRIPS_STORE:
        del TRIPS_STORE[trip_id]
        return {"success": True, "message": "Trip deleted"}

    raise HTTPException(status_code=404, detail="Trip not found")

# ── Share Trip ──
@router.post("/{trip_id}/share")
async def share_trip(trip_id: str, req: ShareRequest):
    share_code = generate_share_code("TRP")
    share_link = f"https://tripsmart.app/trip/{share_code}"
    db         = get_db()

    if db is not None:
        try:
            from bson import ObjectId
            await db.trips.update_one(
                {"_id": ObjectId(trip_id)},
                {"$set": {"shareCode": share_code, "isPublic": req.isPublic}}
            )
        except Exception as e:
            print(f"DB error: {e}")

    return ShareResponse(
        shareCode=share_code,
        shareLink=share_link,
        isPublic=req.isPublic,
    )