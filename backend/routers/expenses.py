from fastapi  import APIRouter, HTTPException, status
from datetime import datetime
from models   import ExpenseCreate
from database import get_db

router = APIRouter(prefix="/expenses", tags=["expenses"])

EXPENSES_STORE: dict = {}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_expense(expense: ExpenseCreate):
    db          = get_db()
    expense_dict = {
        **expense.model_dump(),
        "createdAt": datetime.utcnow(),
    }

    if db is not None:
        try:
            result          = await db.expenses.insert_one(expense_dict)
            expense_dict["id"] = str(result.inserted_id)
            return {"success": True, "expense": expense_dict}
        except Exception as e:
            print(f"DB error: {e}")

    exp_id                  = f"exp_{datetime.utcnow().timestamp()}"
    expense_dict["id"]      = exp_id
    EXPENSES_STORE[exp_id]  = expense_dict
    return {"success": True, "expense": expense_dict}

@router.get("/trip/{trip_id}")
async def get_trip_expenses(trip_id: str):
    db = get_db()
    if db is not None:
        try:
            cursor   = db.expenses.find({"tripId": trip_id})
            expenses = []
            async for exp in cursor:
                exp["id"] = str(exp.pop("_id"))
                expenses.append(exp)
            total = sum(e["amount"] for e in expenses)
            return {"success": True, "expenses": expenses, "total": total}
        except Exception as e:
            print(f"DB error: {e}")

    expenses = [
        e for e in EXPENSES_STORE.values()
        if e.get("tripId") == trip_id
    ]
    total = sum(e["amount"] for e in expenses)
    return {"success": True, "expenses": expenses, "total": total}

@router.delete("/{expense_id}")
async def delete_expense(expense_id: str):
    db = get_db()
    if db is not None:
        try:
            from bson import ObjectId
            result = await db.expenses.delete_one({"_id": ObjectId(expense_id)})
            if result.deleted_count:
                return {"success": True, "message": "Expense deleted"}
        except Exception as e:
            print(f"DB error: {e}")

    if expense_id in EXPENSES_STORE:
        del EXPENSES_STORE[expense_id]
        return {"success": True, "message": "Expense deleted"}

    raise HTTPException(status_code=404, detail="Expense not found")