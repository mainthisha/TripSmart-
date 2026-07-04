from pydantic import BaseModel, Field
from typing   import Optional, List, Dict, Any
from datetime import datetime

# ── Trip Models ──
class TripDetails(BaseModel):
    startDate:  Optional[str]  = None
    duration:   Optional[int]  = 5
    travelers:  Optional[int]  = 2
    tripType:   Optional[str]  = None

class BudgetBreakdown(BaseModel):
    stay:        Optional[float] = 0
    food:        Optional[float] = 0
    transport:   Optional[float] = 0
    activities:  Optional[float] = 0
    misc:        Optional[float] = 0

class Budget(BaseModel):
    total:          Optional[float]          = 0
    accommodation:  Optional[str]            = None
    breakdown:      Optional[BudgetBreakdown] = None
    perPerson:      Optional[float]          = 0
    perDay:         Optional[float]          = 0

class TripCreate(BaseModel):
    destination:  Dict[str, Any]
    tripDetails:  TripDetails
    activities:   List[str]      = []
    budget:       Budget
    shareCode:    Optional[str]  = None
    isPublic:     Optional[bool] = True

class TripResponse(BaseModel):
    id:           str
    destination:  Dict[str, Any]
    tripDetails:  TripDetails
    activities:   List[str]
    budget:       Budget
    shareCode:    str
    isPublic:     bool
    createdAt:    datetime
    updatedAt:    datetime

# ── Expense Models ──
class ExpenseCreate(BaseModel):
    tripId:    str
    label:     str
    category:  str
    amount:    float
    date:      str

class ExpenseResponse(BaseModel):
    id:       str
    tripId:   str
    label:    str
    category: str
    amount:   float
    date:     str

# ── Weather Model ──
class WeatherRequest(BaseModel):
    destination: str
    lat:         float
    lon:         float

# ── Share Models ──
class ShareRequest(BaseModel):
    tripId:   str
    isPublic: bool = True

class ShareResponse(BaseModel):
    shareCode: str
    shareLink: str
    isPublic:  bool