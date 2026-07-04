from fastapi             import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib          import asynccontextmanager
from database            import connect_db, close_db
from routers             import trips, destinations, weather, currency, visa, expenses

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title       = "TripSmart API",
    description = "Backend API for TripSmart - Plan Smarter. Travel Better.",
    version     = "1.0.0",
    lifespan    = lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins     = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ──
app.include_router(trips.router)
app.include_router(destinations.router)
app.include_router(weather.router)
app.include_router(currency.router)
app.include_router(visa.router)
app.include_router(expenses.router)

# ── Root ──
@app.get("/")
async def root():
    return {
        "message": "🌍 TripSmart API is running!",
        "version": "1.0.0",
        "docs":    "/docs",
        "status":  "healthy",
    }

# ── Health Check ──
@app.get("/health")
async def health_check():
    from database import get_db
    db_status = "connected" if get_db() is not None else "disconnected (using memory)"
    return {
        "status":   "healthy",
        "database": db_status,
        "api":      "running",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)