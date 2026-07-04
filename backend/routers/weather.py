from fastapi import APIRouter, HTTPException, Query
from typing  import Optional
import httpx
import os

router = APIRouter(prefix="/weather", tags=["weather"])

CITY_COORDS = {
    "Kerala":      {"lat": 10.8505, "lon": 76.2711},
    "Goa":         {"lat": 15.2993, "lon": 74.1240},
    "Manali":      {"lat": 32.2432, "lon": 77.1892},
    "Ooty":        {"lat": 11.4102, "lon": 76.6950},
    "Switzerland": {"lat": 46.8182, "lon": 8.2275},
    "Paris":       {"lat": 48.8566, "lon": 2.3522},
    "Dubai":       {"lat": 25.2048, "lon": 55.2708},
    "Tokyo":       {"lat": 35.6762, "lon": 139.6503},
    "Bali":        {"lat": -8.3405, "lon": 115.0920},
    "Maldives":    {"lat": 3.2028,  "lon": 73.2207},
    "London":      {"lat": 51.5074, "lon": -0.1278},
    "Singapore":   {"lat": 1.3521,  "lon": 103.8198},
}

weather_cache: dict = {}

@router.get("/{destination}")
async def get_weather(destination: str):
    if destination in weather_cache:
        return {"success": True, "weather": weather_cache[destination], "cached": True}

    coords = CITY_COORDS.get(destination)
    if not coords:
        coords = {"lat": 20.0, "lon": 78.0}

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={coords['lat']}&longitude={coords['lon']}"
        f"&current=temperature_2m,relative_humidity_2m,"
        f"wind_speed_10m,weathercode,apparent_temperature"
        f"&daily=temperature_2m_max,temperature_2m_min,"
        f"weathercode,precipitation_probability_max"
        f"&timezone=auto&forecast_days=6"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            data     = response.json()
            weather_cache[destination] = data
            return {"success": True, "weather": data, "cached": False}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Weather service unavailable: {str(e)}"
        )

@router.get("/coords/")
async def get_weather_by_coords(
    lat: float = Query(...),
    lon: float = Query(...),
):
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,"
        f"wind_speed_10m,weathercode,apparent_temperature"
        f"&daily=temperature_2m_max,temperature_2m_min,"
        f"weathercode,precipitation_probability_max"
        f"&timezone=auto&forecast_days=6"
    )
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            return {"success": True, "weather": response.json()}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Weather service unavailable: {str(e)}"
        )