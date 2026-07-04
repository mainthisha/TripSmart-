from fastapi import APIRouter, Query
from typing  import Optional, List

router = APIRouter(prefix="/destinations", tags=["destinations"])

DESTINATIONS = [
    {
        "id": 1, "name": "Kerala",  "country": "India",
        "emoji": "🌴", "tagline": "God's Own Country",
        "category": "Nature", "best_time": "Oct - Mar",
        "avg_budget": "15000-40000",
        "attractions": [
            "Munnar Tea Gardens", "Alleppey Backwaters",
            "Varkala Beach", "Kovalam Beach", "Fort Kochi",
        ],
    },
    {
        "id": 2, "name": "Goa", "country": "India",
        "emoji": "🏖️", "tagline": "Pearl of the Orient",
        "category": "Beach", "best_time": "Nov - Feb",
        "avg_budget": "12000-35000",
        "attractions": [
            "Baga Beach", "Dudhsagar Falls", "Old Goa Churches",
            "Fort Aguada", "Palolem Beach",
        ],
    },
    {
        "id": 3, "name": "Manali", "country": "India",
        "emoji": "🏔️", "tagline": "Valley of the Gods",
        "category": "Adventure", "best_time": "Oct - Jun",
        "avg_budget": "10000-30000",
        "attractions": [
            "Rohtang Pass", "Solang Valley", "Hadimba Temple",
            "Beas River", "Jogini Waterfall",
        ],
    },
    {
        "id": 4, "name": "Paris",  "country": "France",
        "emoji": "🗼", "tagline": "City of Light",
        "category": "Cultural", "best_time": "Apr - Oct",
        "avg_budget": "150000-350000",
        "attractions": [
            "Eiffel Tower", "Louvre Museum", "Montmartre",
            "Arc de Triomphe", "Seine River Cruise",
        ],
    },
    {
        "id": 5, "name": "Dubai",  "country": "UAE",
        "emoji": "🌆", "tagline": "City of Dreams",
        "category": "Luxury", "best_time": "Nov - Apr",
        "avg_budget": "80000-250000",
        "attractions": [
            "Burj Khalifa", "Dubai Mall", "Palm Jumeirah",
            "Desert Safari", "Gold Souk",
        ],
    },
    {
        "id": 6, "name": "Tokyo",  "country": "Japan",
        "emoji": "🏯", "tagline": "Where Tradition Meets Future",
        "category": "Cultural", "best_time": "Mar - May",
        "avg_budget": "120000-300000",
        "attractions": [
            "Shibuya Crossing", "Senso-ji Temple", "Mount Fuji",
            "Shinjuku", "Tokyo Tower",
        ],
    },
    {
        "id": 7, "name": "Bali",   "country": "Indonesia",
        "emoji": "🌺", "tagline": "Island of the Gods",
        "category": "Beach", "best_time": "Apr - Oct",
        "avg_budget": "60000-150000",
        "attractions": [
            "Tanah Lot Temple", "Ubud Rice Terraces",
            "Seminyak Beach", "Mount Batur", "Uluwatu Temple",
        ],
    },
    {
        "id": 8, "name": "Maldives", "country": "Maldives",
        "emoji": "🏝️", "tagline": "Tropical Paradise",
        "category": "Luxury", "best_time": "Nov - Apr",
        "avg_budget": "150000-500000",
        "attractions": [
            "Overwater Bungalows", "Snorkeling", "Maafushi Island",
            "Sunset Cruises", "Whale Shark Spotting",
        ],
    },
]

@router.get("/")
async def get_destinations(
    category: Optional[str] = Query(None),
    search:   Optional[str] = Query(None),
    limit:    int            = Query(20, ge=1, le=50),
):
    results = DESTINATIONS
    if category and category.lower() != "all":
        results = [
            d for d in results
            if d["category"].lower() == category.lower()
        ]
    if search:
        q       = search.lower()
        results = [
            d for d in results
            if q in d["name"].lower()
            or q in d["country"].lower()
            or q in d["tagline"].lower()
        ]
    return {
        "success":      True,
        "destinations": results[:limit],
        "count":        len(results[:limit]),
    }

@router.get("/{dest_id}")
async def get_destination(dest_id: int):
    dest = next((d for d in DESTINATIONS if d["id"] == dest_id), None)
    if not dest:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"success": True, "destination": dest}

@router.get("/name/{name}")
async def get_destination_by_name(name: str):
    dest = next(
        (d for d in DESTINATIONS if d["name"].lower() == name.lower()),
        None
    )
    if not dest:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"success": True, "destination": dest}