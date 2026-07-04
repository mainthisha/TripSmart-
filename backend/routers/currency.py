from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/currency", tags=["currency"])

currency_cache: dict = {}

FALLBACK_RATES = {
    "INR": 1,      "USD": 0.012,  "EUR": 0.011,
    "GBP": 0.0095, "AED": 0.044,  "SGD": 0.016,
    "JPY": 1.80,   "CHF": 0.011,  "IDR": 190.5,
    "THB": 0.43,
}

@router.get("/rates")
async def get_exchange_rates(base: str = "INR"):
    cache_key = f"rates_{base}"
    if cache_key in currency_cache:
        return {
            "success": True,
            "rates":   currency_cache[cache_key],
            "base":    base,
            "cached":  True,
        }

    try:
        url = f"https://api.exchangerate-api.com/v4/latest/{base}"
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url)
            data     = response.json()
            if "rates" in data:
                currency_cache[cache_key] = data["rates"]
                return {
                    "success": True,
                    "rates":   data["rates"],
                    "base":    base,
                    "cached":  False,
                }
    except Exception as e:
        print(f"Currency API error: {e}")

    return {
        "success":  True,
        "rates":    FALLBACK_RATES,
        "base":     "INR",
        "cached":   False,
        "fallback": True,
    }

@router.get("/convert")
async def convert_currency(
    amount: float,
    from_currency: str = "INR",
    to_currency:   str = "USD",
):
    rates_data = await get_exchange_rates(from_currency)
    rates      = rates_data.get("rates", FALLBACK_RATES)

    if to_currency not in rates:
        raise HTTPException(
            status_code=400,
            detail=f"Currency {to_currency} not supported"
        )

    converted = amount * rates[to_currency]
    return {
        "success":       True,
        "from":          from_currency,
        "to":            to_currency,
        "amount":        amount,
        "converted":     round(converted, 2),
        "rate":          rates[to_currency],
    }