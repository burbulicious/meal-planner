import { defineStore } from 'pinia'
import type { WeeklyMealPlan, RecipeExtended, MealType, Ingredient } from '@/types/recipes'
import { getMealPlan, getFullRecipes, getFullIngredientList } from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
  mealPlanKey,
  ingredientsKey,
  allRecipesKey,
  caloriesLimitKey,
  allExtractedIngredientsKey
} from '@/utils/handleLocalStorage'

const initialMealPlanStructure = {
  monday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  tuesday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  wednesday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  thursday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  friday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  saturday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  sunday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  }
}
const initialCaloriesLimit: number = getDataFromLocalStorage(caloriesLimitKey) || 2000
const initialmealPlan: WeeklyMealPlan =
  getDataFromLocalStorage(mealPlanKey) || initialMealPlanStructure
const initialIngredients: string =
  (localStorage.getItem(ingredientsKey) as string) || ('' as string)
const initialRecipes: RecipeExtended[] = getDataFromLocalStorage(allRecipesKey) || []
const initialExtractedIngredients: Ingredient[] =
  getDataFromLocalStorage(allExtractedIngredientsKey) || []

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialmealPlan } as WeeklyMealPlan,
    ingredients: initialIngredients,
    allRecipes: initialRecipes as RecipeExtended[],
    caloriesLimit: initialCaloriesLimit as number,
    extractedIngredients: initialExtractedIngredients as Ingredient[]
  }),

  actions: {
    setIngredients(updatedIngredients: string) {
      this.ingredients = updatedIngredients
      localStorage.setItem(ingredientsKey, this.ingredients)
    },
    addIngredient(newIngredient: string) {
      const ingredientToAdd: string = newIngredient.trim().toLowerCase()
      const ingredientsList: string[] = this.ingredients.toLowerCase().split(',')
      if (!ingredientsList.find((item) => item.trim() === ingredientToAdd)) {
        if (this.ingredients) {
          this.ingredients += `, ${ingredientToAdd}`
        } else {
          this.ingredients = ingredientToAdd
        }
        localStorage.setItem(ingredientsKey, this.ingredients)
      }
    },
    removeIngredient(inputIngredient: string) {
      const ingredientToRemove: string = inputIngredient.trim()
      const ingredientsList: string[] = this.ingredients.toLowerCase().split(',')
      if (ingredientsList.find((item) => item.trim() === ingredientToRemove)) {
        this.ingredients = ingredientsList
          .map((item) => item.trim())
          .filter((item) => item !== ingredientToRemove)
          .join(', ')
        localStorage.setItem(ingredientsKey, this.ingredients)
      }
    },
    async setMealPlan(): Promise<void> {
      this.mealPlan = await getMealPlan(this.ingredients, this.caloriesLimit)
      storeDataInLocalStorage(mealPlanKey, this.mealPlan)
      this.allRecipes = await getFullRecipes(this.mealPlan)
      storeDataInLocalStorage(allRecipesKey, this.allRecipes)
      this.setExtractedIngredients()
    },
    setCaloriesLimit(newCaloriesLimit: number): void {
      this.caloriesLimit = newCaloriesLimit
      storeDataInLocalStorage(caloriesLimitKey, this.caloriesLimit)
    },
    getMealsByMealType(mealType: MealType): RecipeExtended[] {
      return this.allRecipes.filter((meal) => meal.mealType === mealType)
    },
    setExtractedIngredients() {
      const extractedIngredients = getFullIngredientList(this.allRecipes)
      this.extractedIngredients = extractedIngredients
      storeDataInLocalStorage(allExtractedIngredientsKey, this.extractedIngredients)
    }
  },
  getters: {
    getMealPlan(): WeeklyMealPlan {
      return this.mealPlan
    },
    getIngredients(): string {
      return this.ingredients
    },
    getAllrecipes(): RecipeExtended[] {
      return this.allRecipes
    },
    getCaloriesLimit(): number {
      return this.caloriesLimit
    },
    getExtractedIngredients(): Ingredient[] {
      return this.extractedIngredients
    }
  }
})
