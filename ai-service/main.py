from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="CookMarket AI Service")

class IngredientRequest(BaseModel):
    ingredients: list[str]

@app.get("/")
def root():
    return {"message": "CookMarket AI Service"}

@app.post("/suggest-recipe")
def suggest_recipe(request: IngredientRequest):
    ingredients = ", ".join(request.ingredients)
    return {
        "title": "Recette proposée",
        "ingredients": request.ingredients,
        "steps": [
            "Préparer les ingrédients.",
            "Cuire les éléments principaux.",
            "Assaisonner selon le goût.",
            "Servir chaud."
        ],
        "note": f"Recette générée à partir de : {ingredients}"
    }
