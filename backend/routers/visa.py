from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/visa", tags=["visa"])

VISA_DATA = {
    "Kerala":      {
        "required": False, "type": "No Visa (Domestic)",
        "processing": "N/A", "fee": "Free", "validity": "N/A",
        "documents": ["Aadhaar Card", "Valid ID Proof"],
        "rules":     ["Indian citizens travel freely"],
        "note":      "Domestic travel within India.",
    },
    "Goa":         {
        "required": False, "type": "No Visa (Domestic)",
        "processing": "N/A", "fee": "Free", "validity": "N/A",
        "documents": ["Aadhaar Card", "Valid ID Proof"],
        "rules":     ["Indian citizens travel freely"],
        "note":      "Domestic travel within India.",
    },
    "Manali":      {
        "required": False, "type": "No Visa (Domestic)",
        "processing": "N/A", "fee": "Free", "validity": "N/A",
        "documents": ["Aadhaar Card"],
        "rules":     [
            "Indian citizens travel freely",
            "Inner Line Permit may be needed for restricted areas",
        ],
        "note": "Some restricted areas require Inner Line Permit.",
    },
    "Switzerland": {
        "required": True, "type": "Schengen Visa (Type C)",
        "processing": "15-30 days", "fee": "80 EUR (~7200 INR)",
        "validity": "90 days",
        "documents": [
            "Valid Passport (6+ months)", "Bank Statements (3 months)",
            "Travel Insurance", "Hotel Bookings", "Flight Tickets",
            "ITR / Salary Slips", "Cover Letter",
        ],
        "rules": [
            "Stay max 90 days in 180-day period",
            "Travel insurance mandatory (min 30000 EUR)",
        ],
        "applyAt": "VFS Global or Swiss Embassy",
        "note":    "Apply 3-4 weeks before travel.",
    },
    "Paris":       {
        "required": True, "type": "Schengen Visa (Type C)",
        "processing": "15-30 days", "fee": "80 EUR (~7200 INR)",
        "validity": "90 days",
        "documents": [
            "Valid Passport (6+ months)", "Bank Statements",
            "Travel Insurance", "Hotel Bookings", "Flight Tickets",
        ],
        "rules": [
            "Stay max 90 days in 180-day period",
            "Travel insurance mandatory",
        ],
        "applyAt": "VFS Global France or French Embassy",
        "note":    "France is part of the Schengen Area.",
    },
    "Dubai":       {
        "required": True, "type": "UAE Tourist Visa / Visa on Arrival",
        "processing": "3-5 days", "fee": "AED 250-500",
        "validity": "30-90 days",
        "documents": [
            "Valid Passport (6+ months)", "Passport Photo",
            "Bank Statement", "Hotel Booking", "Return Flight",
        ],
        "rules": [
            "Dress modestly in public areas",
            "Alcohol only in licensed places",
        ],
        "applyAt": "Emirates Airlines or Dubai Tourism Website",
        "note":    "Indian passport holders can get Visa on Arrival.",
    },
    "Tokyo":       {
        "required": True, "type": "Tourist Visa",
        "processing": "5-10 days", "fee": "JPY 3000 (~1700 INR)",
        "validity": "90 days",
        "documents": [
            "Valid Passport (6+ months)", "Bank Statements",
            "Hotel Bookings", "Return Flight", "Employment Letter",
        ],
        "rules": [
            "No drugs strictly",
            "Be quiet in public transport",
            "Cash preferred",
        ],
        "applyAt": "Japan Embassy or Consulate",
        "note":    "Check latest visa-free status before travel.",
    },
    "Bali":        {
        "required": True, "type": "Visa on Arrival (VOA)",
        "processing": "On arrival", "fee": "IDR 500000 (~2600 INR)",
        "validity": "30 days",
        "documents": [
            "Valid Passport (6+ months)", "Return Flight Ticket",
            "Hotel Booking", "Sufficient Funds Proof",
        ],
        "rules": [
            "Respect temple customs",
            "Wear sarong at temples",
            "No drugs - strict laws",
        ],
        "applyAt": "Bali Ngurah Rai Airport (on arrival)",
        "note":    "Extendable once for additional 30 days.",
    },
    "Maldives":    {
        "required": False, "type": "Visa on Arrival (Free)",
        "processing": "On arrival", "fee": "Free",
        "validity": "30 days",
        "documents": [
            "Valid Passport (6+ months)", "Return Flight Ticket",
            "Hotel Booking",
        ],
        "rules": [
            "No alcohol outside resort islands",
            "Modest dress in local islands",
        ],
        "note": "Indians get free 30-day visa on arrival.",
    },
    "London":      {
        "required": True, "type": "UK Standard Visitor Visa",
        "processing": "15-21 days", "fee": "GBP 115 (~12000 INR)",
        "validity": "6 months",
        "documents": [
            "Valid Passport", "Bank Statements (6 months)",
            "Salary Slips", "Employment Letter", "Hotel Bookings",
        ],
        "rules": [
            "No work on visitor visa",
            "Biometrics required",
        ],
        "applyAt": "VFS Global UK Visa Application Centre",
        "note":    "UK needs separate visa even with Schengen visa.",
    },
    "Singapore":   {
        "required": True, "type": "Singapore Tourist Visa",
        "processing": "3-5 days", "fee": "SGD 30 (~1900 INR)",
        "validity": "30 days",
        "documents": [
            "Valid Passport (6+ months)", "Bank Statements",
            "Hotel Booking", "Return Flight",
        ],
        "rules": [
            "No chewing gum",
            "No littering (heavy fine)",
            "Drugs - death penalty",
        ],
        "applyAt": "Singapore Embassy or authorized agents",
        "note":    "Apply minimum 2 weeks before travel.",
    },
}

@router.get("/{destination}")
async def get_visa_info(destination: str):
    info = VISA_DATA.get(destination)
    if not info:
        return {
            "success":     True,
            "destination": destination,
            "info":        None,
            "message":     f"Visa info not available for {destination}",
        }
    return {
        "success":     True,
        "destination": destination,
        "info":        info,
    }

@router.get("/")
async def get_all_visa_info():
    return {
        "success":      True,
        "destinations": list(VISA_DATA.keys()),
        "count":        len(VISA_DATA),
    }